import os
import glob
import hashlib
from src.generators import simulate

print("=== STEP 1: EXECUTING FULL 2-YEAR SIMULATION (RUN 1 -> data/generated) ===")
simulate.run_simulation(is_smoke_test=False, override_output_dir="data/generated")

print("\n=== STEP 1: EXECUTING FULL 2-YEAR SIMULATION (RUN 2 -> data/generated_verify) ===")
simulate.run_simulation(is_smoke_test=False, override_output_dir="data/generated_verify")

print("\n=== STEP 1: FIELD-BY-FIELD DETERMINISM DIFF CHECK ===")

gen_files = sorted(glob.glob("data/generated/*"))
verify_files = sorted(glob.glob("data/generated_verify/*"))

all_identical = True
file_diffs = {}

for g_path in gen_files:
    fname = os.path.basename(g_path)
    v_path = os.path.join("data/generated_verify", fname)
    
    if not os.path.exists(v_path):
        print(f"❌ Missing verification file: {v_path}")
        all_identical = False
        continue

    with open(g_path, "rb") as f1, open(v_path, "rb") as f2:
        g_bytes = f1.read()
        v_bytes = f2.read()

    g_hash = hashlib.sha256(g_bytes).hexdigest()
    v_hash = hashlib.sha256(v_bytes).hexdigest()

    if g_hash == v_hash:
        print(f"[PASS] {fname}: BYTE-IDENTICAL (SHA256: {g_hash[:12]}...)")
    else:
        print(f"[FAIL] {fname}: MISMATCH DETECTED!")
        all_identical = False
        # Line by line diff
        g_lines = g_bytes.decode("utf-8").splitlines()
        v_lines = v_bytes.decode("utf-8").splitlines()
        diff_count = 0
        first_diff = None
        for l_idx, (l1, l2) in enumerate(zip(g_lines, v_lines)):
            if l1 != l2:
                diff_count += 1
                if first_diff is None:
                    first_diff = (l_idx + 1, l1, l2)
        print(f"   Line count: {len(g_lines)} vs {len(v_lines)}, total line diffs: {diff_count}")
        if first_diff:
            print(f"   First diff at line {first_diff[0]}:\n     Run 1: {first_diff[1]}\n     Run 2: {first_diff[2]}")

if all_identical:
    print("\n[SUCCESS] DETERMINISM CONFIRMED: All generated files across both 2-year simulation runs are 100% BYTE-IDENTICAL!")
else:
    print("\n[FAILURE] DETERMINISM FAILURE: Divergence detected between Run 1 and Run 2.")

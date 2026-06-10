import os

src_dir = r"c:\Users\Sharli\Documents\Tecno Ventas\frontend\src"
search_terms = ["localhost", "8000", "8005", "fetch(", "axios"]

for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith((".js", ".jsx", ".css")):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
                for term in search_terms:
                    if term in content:
                        print(f"Match found in {path}: term '{term}'")
                        # print first 5 lines containing the term
                        lines = content.splitlines()
                        for i, line in enumerate(lines):
                            if term in line:
                                print(f"  Line {i+1}: {line.strip()}")

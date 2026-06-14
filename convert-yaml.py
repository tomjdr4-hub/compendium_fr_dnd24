import yaml, json, os, sys

SRC = os.path.join(os.path.dirname(__file__), "packs", "_source")

total = 0
for pack in sorted(os.listdir(SRC)):
    pack_path = os.path.join(SRC, pack)
    if not os.path.isdir(pack_path):
        continue
    print(f"\n=== Pack: {pack} ===")
    for root, dirs, files in os.walk(pack_path):
        dirs.sort()
        for fname in sorted(files):
            fpath = os.path.join(root, fname)
            if not fname.endswith(".yml"):
                continue
            # Supprimer les fichiers _folder.yml sans les convertir
            if fname.startswith("_"):
                os.remove(fpath)
                continue
            try:
                with open(fpath, "r", encoding="utf-8") as f:
                    data = yaml.safe_load(f)
                if not data or "_id" not in data:
                    print(f"  Ignoré (pas _id): {fname}")
                    os.remove(fpath)
                    continue
                json_path = fpath[:-4] + ".json"
                with open(json_path, "w", encoding="utf-8") as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                os.remove(fpath)
                print(f"  OK: {data.get('name', fname)}")
                total += 1
            except Exception as e:
                print(f"  ERREUR {fname}: {e}")

print(f"\n{total} fichiers convertis.")

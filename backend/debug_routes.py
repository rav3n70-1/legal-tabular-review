from app import app
import json

print("\n--- Registered Routes ---")
for route in app.routes:
    print(f"{route.path} [{', '.join(route.methods)}]")
print("-------------------------\n")

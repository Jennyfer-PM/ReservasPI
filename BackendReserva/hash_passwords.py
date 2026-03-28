# hash_passwords.py
import bcrypt
from sqlalchemy import create_engine, text

print("=== HASHEANDO CONTRASEÑAS ===\n")

# Conectar a la base de datos
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:Tequiero2505@localhost:5432/PI-CheckPoint"
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Mapeo de usuarios con sus contraseñas originales
usuarios = {
    1: {'correo': 'adminteodora@upq.edu.mx', 'password': 'admin123'},
    2: {'correo': 'armando.gomez@upq.edu.mx', 'password': 'docente123'},
    3: {'correo': 'maria.morales@upq.edu.mx', 'password': 'docente123'},
    4: {'correo': '124049915@upq.edu.mx', 'password': 'alumno123'},
    5: {'correo': '326791327@upq.edu.mx', 'password': 'alumno123'}
}

with engine.connect() as conn:
    # Primero, verificar estado actual
    print("=== ESTADO ACTUAL ===")
    result = conn.execute(text("SELECT id, correoi, clave FROM personas"))
    for row in result:
        es_hash = row[2].startswith('$2b$') if row[2] else False
        print(f"ID {row[0]}: {row[1]} -> {'HASHEADO' if es_hash else 'TEXTO PLANO'}")

    print("\n=== HASHEANDO CONTRASEÑAS ===")
    
    # Hashear cada contraseña
    for user_id, data in usuarios.items():
        # Generar hash bcrypt
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(data['password'].encode('utf-8'), salt)
        hashed_str = hashed.decode('utf-8')
        
        # Actualizar en la base de datos
        conn.execute(
            text("UPDATE personas SET clave = :clave WHERE id = :id"),
            {"clave": hashed_str, "id": user_id}
        )
        print(f"✅ ID {user_id} ({data['correo']}): '{data['password']}' -> hasheado")
    
    # Guardar cambios
    conn.commit()
    
    # Verificar resultados
    print("\n=== ESTADO FINAL ===")
    result = conn.execute(text("SELECT id, correoi, clave FROM personas"))
    for row in result:
        es_hash = row[2].startswith('$2b$') if row[2] else False
        print(f"ID {row[0]}: {row[1]} -> {'HASHEADO' if es_hash else 'TEXTO PLANO'}")

print("\n✅ Proceso completado! Ahora el login funcionará correctamente.")
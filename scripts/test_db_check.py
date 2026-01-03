def main():
    import importlib
    import sys
    sys.path.insert(0, r"C:\Users\merino\Downloads\GFGBQ-Team-shestorm")
    from backend.app import database
    print('DB engine before:', database.engine)
    # create test engine
    from sqlalchemy import create_engine
    engine=create_engine("sqlite:///:memory:",connect_args={"check_same_thread":False})
    from sqlalchemy.orm import sessionmaker
    TestingSessionLocal=sessionmaker(autocommit=False,autoflush=False,bind=engine)
    # replace database engine
    database.engine=engine
    database.SessionLocal=TestingSessionLocal
    # import models
    import backend.models as models
    importlib.reload(models)
    try:
        print('Models imported, Base tables:', list(models.Base.metadata.tables.keys()))
        # create all
        models.Base.metadata.create_all(bind=engine)
        print('After create_all, tables:', list(models.Base.metadata.tables.keys()))
    except Exception as e:
        print('Could not inspect models.Base:', e)
    # inspect actual sqlite_master
    conn=engine.raw_connection()
    c=conn.cursor()
    c.execute("SELECT name FROM sqlite_master WHERE type='table';")
    print('SQLite tables:', c.fetchall())
    conn.close()

if __name__ == '__main__':
    main()


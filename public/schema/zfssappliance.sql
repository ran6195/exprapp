-- SQLite
DROP TABLE IF EXISTS zfsappliance; 
CREATE TABLE zfsappliance ( id INTEGER PRIMARY KEY , 
                            nome TEXT , 
                            dc TEXT ,
                            utente TEXT ,
                            pass TEXT ,
                            addr1 TEXT ,
                            addr2 TEXT
                            )
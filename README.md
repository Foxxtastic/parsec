# parsec
parsing everything

-A backenden használt nlp (ez az a library ami szövegfeldolgozást végez) mérete miatt ingyenes hosting kizárva (jelenlegi észrevételem szerint)

-van docker container, de az sem hostolható (ingyen, mivel nagy méretűek), fizikailag nem másolható (lokáció rejtett).

Az adatbázis önmagában fent van a herokun - azt használjuk lokálisan is. Így azt nem kell minden gépen megcsinálni.

Backend (python): cd ./backend -> pip install -r requirements.txt (virtuális környezetben célszerű)

c:\Python35\python -m venv c:\...project_helye\backend\myenv

  python -m flask run

Client: cd ./client -> npm install

  npm start

Az app menük: 
- dokumentum: Txt- fájl feltöltése, az adatbázisban levő fájlok táblázatban, a adott sorra használhatjuk az adott szövegfájlt.

- kulcsszavak: a keresendő kulcsszavak listája (több szóból álló kifejezés is lehet).

- töltelékszavak: itt is van lista (módosítható), de még nincs használva (az nlp-nek van saját töltelékszó gyűjteménye)

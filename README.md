# parsec
parsing everything

-A backenden használt nlp (ez az a library ami szövegfeldolgozást végez) mérete miatt ingyenes hosting kizárva (jelenlegi észrevételem szerint)

Az adatbázis önmagában fent van a herokun - azt használjuk lokálisan is. Így azt nem kell minden gépen megcsinálni.

docker: docker-compose up

Az app menük: 
- dokumentum: Txt- fájl feltöltése, az adatbázisban levő fájlok táblázatban, a adott sorra használhatjuk az adott szövegfájlt.

- kulcsszavak: a keresendő kulcsszavak listája (több szóból álló kifejezés is lehet).

- töltelékszavak: itt is van lista (módosítható), de még nincs használva (az nlp-nek van saját töltelékszó gyűjteménye)

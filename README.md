# Projekt

Dieses Projekt wurde im Rahmen des Moduls "Implementierung von Prozessen" an der TH Brandenburg
erstellt.

## Anleitung - Wie bekomme ich die API zum laufen?

1. Erstelle einen Ordner für das Projekt bspw. auf dem Desktop mit dem Namen "API"
2. Öffne die Kommandozeile und navigiere in den Ordner "API" oder öffne den Ordner in VS Code und öffne die integrierte Kommandozeile (Terminal -> New Terminal)
3. Führe folgenden Befehl aus, um ein Repository zu erstellen `git init`
4. Füge das Repository von GitHub als Remote hinzu, führe dafür folgenden Befehl in dem Terminal aus `git remote add upstream https://github.com/max-got/ivp2023.git`
5. Führe folgenden Befehl aus, um die Dateien aus dem Repository herunterzuladen `git pull upstream master`
6. Führe folgenden Befehl aus, um die Abhängigkeiten zu installieren `npm install`
7. Starte die Docker Engine, falls diese noch nicht läuft.
8. Führe folgenden Befehl aus, um die Datenbank zu starten `docker-compose up`
9. Führe folgenden Befehl aus, um das schema in der 'prisma/schema.prisma' Datei in die Datenbank zu übertragen `npx prisma db push --force-reset` (Dieser Befehl muss ausgeführt werden, wenn sich das Schema geändert hat)
10. Führe folgenden Befehl aus, um die die Datenbank mit den Testdaten zu füllen `npx prisma db seed` (Dieser Befehl muss ausgeführt werden, wenn du den Befehl in Schritt 9 ausgeführt hast!)
11. Führe folgenden Befehl aus, um die API zu starten `npm run dev`
12. Öffne einen Browser und navigiere zu `http://localhost:4000/health` um die API zu testen

## Anleitung - Wie kann ich die Docs aufrufen?

1. Starte die API wie in Schritt 11 der obigen Anleitung beschrieben
2. Öffne einen Browser und navigiere zu `http://localhost:4000/docs` um die Docs zu öffnen

## Anleitung - Wie kann ich die Daten in [Insomnia](https://insomnia.rest/) importieren?

1. Stoppe die API, falls diese noch läuft (Strg + C in der Kommandozeile, in der die API läuft)
2. Öffne die Kommandozeile in VSCode und starte den Befeghl `npm run generate:swagger`
3. Öffne Insomnia und navigiere zu und suche nach dem Menüpunkt "Insomnia" -> "Preferences" -> "Data" -> "Import to the Project" -> "From File"
4. Wähle die Datei `swagger_output.json` aus dem Projektordner aus, diese befindet sich im Ordner `src/swagger/`
5. Nach dem Importieren solltest du mehrere Ordner in Insomnia sehen, diese Ordner entsprechen den verschiedenen Endpunkten der API. ACHTUNG: du musst die environment variables noch anpassen, damit die API funktioniert. Dafür musst du die Variable `base_url` auf `http://localhost:4000` setzen. Unter folgendem Link findest du eine Anleitung, wie du die environment variables anpassen kannst: [https://docs.insomnia.rest/insomnia/environment-variables](https://docs.insomnia.rest/insomnia/environment-variables)
6. Starte die API wie in Schritt 11 der obigen Anleitung beschrieben und teste die API in Insomnia

## Anleitung - Wie kann ich die Daten in der Datenbank sehen/ändern?

1. Öffne ein neues Terminal in VSCode (Terminal -> New Terminal) und führe folgenden Befehl aus, um die Daten in der Datenbank zu sehen und zu ändern `npx prisma studio`
2. Öffne einen Browser und navigiere zu `http://localhost:5555/`, jetzt solltest du die Daten in der Datenbank sehen und ändern können.

## Anleitung - Wie kann ich das Repository aktualisieren?

1. Öffne die Kommandozeile und navigiere in den Ordner "API" oder öffne den Ordner in VS Code und öffne die integrierte Kommandozeile (Terminal -> New Terminal)
2. Führe folgenden Befehl aus, um das Repository zu aktualisieren `git pull upstream master`
3. Was passiert, wenn ich eine Fehlermeldung bekomme? -> Schreib mich an, ich helfe dir gerne weiter!

## Ich habe eine Frage, was soll ich tun?

Schreib mich an!

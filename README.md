# tu2bo-notificationserver
TúTubo - Notification Server

## About
Agente auxiliar para el envío de push notifications a los distintos clientes mobile, basado en eventos de negocio que transcurren en los servidores core (por ejemplo, solicitudes de amistad).

## Credenciales
Es necesario tener un archivo JSON "tu2bo-131ec-32a6ace4f2e8.json", con las credenciales para acceder a la base de Firebase

## Development

## Build y corrida

Para buildear y levantar el servidor, hay 2 alternativas: corriendolo como proceso en la consola o levantando un container.
De cualquiera de ambas formas, se puede probar si el srv esta levantado, haciendo en otra consola:

	make ping

#### Con npm

- `make run`

#### Con Docker

- `docker-compose up --build`, o bien
- `./run.sh`

En cualquiera de los casos, para salir, hacer `Ctrl+c` sobre la consola donde se ejecuto el comando.

## Tests & Coverage

Para testear, hacer un install y correr test:

- `make install`
- `make test`

Junto a la salida de la corrida, estara incluido el reporte de coverage.

### Deployment

Para deployar a Heroku, seguir los siguientes pasos:

1. Loguearse a Heroku (prompt en browser): `heroku login`
2. Loguearse al registry de Heroku: `heroku container:login`
3. Buildear y pushear nueva imagen a Heroku: `make heroku-push`
4. Cambiar instancia para usar la nueva imagen: `make heroku-release`
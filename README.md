##About
nothing special here

##Buld and run
Dev:
```
yarn run dev
```

Build:
```
yarn run build
```

Key:
```
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365
openssl pkcs12 -export -out domain.name.pfx -inkey key.pem -in cert.pem
```
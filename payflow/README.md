# payflow

A new Flutter project.

## Getting Started

This project is a starting point for a Flutter application.

A few resources to get you started if this is your first Flutter project:

- [Lab: Write your first Flutter app](https://flutter.dev/docs/get-started/codelab)
- [Cookbook: Useful Flutter samples](https://flutter.dev/docs/cookbook)

For help getting started with Flutter, view our
[online documentation](https://flutter.dev/docs), which offers tutorials,
samples, guidance on mobile development, and a full API reference.

## Firebase

### Registrar app

* **Nome do Pacote do Android**: com.example.payflow
  - Representa o **applicationId** no arquivo **build.gradle**.
  - Encontrado em: android/app/src/main/AndroidManifest.xml
    - manifest._package
* **Apelido do app**: PayFlow Android
  - Utilizado no Consolel do Firebase para representá-lo.
* **Certificado de assinatura de depuração SHA-1**: 52:E1:14:28:17:6A:6E:D6:81:7F:FF:2A:F4:95:39:DC:8F:E5:58:8C
  - [Link de referencia](https://developers.google.com/android/guides/client-auth)

* keytool -list -v -alias androiddebugkey -keystore ~/.android/debug.keystore
```
Informe a senha da área de armazenamento de chaves:  
Nome do alias: androiddebugkey
Data de criação: 23 de jun. de 2021
Tipo de entrada: PrivateKeyEntry
Comprimento da cadeia de certificados: 1
Certificado[1]:
Proprietário: C=US, O=Android, CN=Android Debug
Emissor: C=US, O=Android, CN=Android Debug
Número de série: 1
Válido de: Wed Jun 23 12:49:18 BRT 2021 até: Fri Jun 16 12:49:18 BRT 2051
Fingerprints do certificado:
         SHA1: 52:E1:14:28:17:6A:6E:D6:81:7F:FF:2A:F4:95:39:DC:8F:E5:58:8C
         SHA256: 21:45:0B:4A:47:1D:DE:63:1B:C5:DD:1F:0D:11:99:27:F6:18:4A:90:66:1F:EE:DC:14:C9:67:A7:86:B9:53:F9
Nome do algoritmo de assinatura: SHA1withRSA
Algoritmo de Chave Pública do Assunto: Chave RSA de 2048 bits
Versão: 1
```

* ./android/gradlew signingReport
```
Welcome to Gradle 6.7!

Here are the highlights of this release:
 - File system watching is ready for production use
 - Declare the version of Java your build requires
 - Java 15 support

For more details see https://docs.gradle.org/6.7/release-notes.html

Starting a Gradle Daemon, 1 busy Daemon could not be reused, use --status for details

> Task :app:signingReport
Variant: debug
Config: debug
Store: /home/daniel/.android/debug.keystore
Alias: AndroidDebugKey
MD5: 27:9D:6A:18:0F:D6:44:20:39:19:8C:95:2F:9B:0C:0F
SHA1: 52:E1:14:28:17:6A:6E:D6:81:7F:FF:2A:F4:95:39:DC:8F:E5:58:8C
SHA-256: 21:45:0B:4A:47:1D:DE:63:1B:C5:DD:1F:0D:11:99:27:F6:18:4A:90:66:1F:EE:DC:14:C9:67:A7:86:B9:53:F9
Valid until: sexta-feira, 16 de junho de 2051
----------
Variant: release
Config: debug
Store: /home/daniel/.android/debug.keystore
Alias: AndroidDebugKey
MD5: 27:9D:6A:18:0F:D6:44:20:39:19:8C:95:2F:9B:0C:0F
SHA1: 52:E1:14:28:17:6A:6E:D6:81:7F:FF:2A:F4:95:39:DC:8F:E5:58:8C
SHA-256: 21:45:0B:4A:47:1D:DE:63:1B:C5:DD:1F:0D:11:99:27:F6:18:4A:90:66:1F:EE:DC:14:C9:67:A7:86:B9:53:F9
Valid until: sexta-feira, 16 de junho de 2051
----------
Variant: profile
Config: debug
Store: /home/daniel/.android/debug.keystore
Alias: AndroidDebugKey
MD5: 27:9D:6A:18:0F:D6:44:20:39:19:8C:95:2F:9B:0C:0F
SHA1: 52:E1:14:28:17:6A:6E:D6:81:7F:FF:2A:F4:95:39:DC:8F:E5:58:8C
SHA-256: 21:45:0B:4A:47:1D:DE:63:1B:C5:DD:1F:0D:11:99:27:F6:18:4A:90:66:1F:EE:DC:14:C9:67:A7:86:B9:53:F9
Valid until: sexta-feira, 16 de junho de 2051
----------
Variant: debugAndroidTest
Config: debug
Store: /home/daniel/.android/debug.keystore
Alias: AndroidDebugKey
MD5: 27:9D:6A:18:0F:D6:44:20:39:19:8C:95:2F:9B:0C:0F
SHA1: 52:E1:14:28:17:6A:6E:D6:81:7F:FF:2A:F4:95:39:DC:8F:E5:58:8C
SHA-256: 21:45:0B:4A:47:1D:DE:63:1B:C5:DD:1F:0D:11:99:27:F6:18:4A:90:66:1F:EE:DC:14:C9:67:A7:86:B9:53:F9
Valid until: sexta-feira, 16 de junho de 2051
----------
Variant: debugUnitTest
Config: debug
Store: /home/daniel/.android/debug.keystore
Alias: AndroidDebugKey
MD5: 27:9D:6A:18:0F:D6:44:20:39:19:8C:95:2F:9B:0C:0F
SHA1: 52:E1:14:28:17:6A:6E:D6:81:7F:FF:2A:F4:95:39:DC:8F:E5:58:8C
SHA-256: 21:45:0B:4A:47:1D:DE:63:1B:C5:DD:1F:0D:11:99:27:F6:18:4A:90:66:1F:EE:DC:14:C9:67:A7:86:B9:53:F9
Valid until: sexta-feira, 16 de junho de 2051
----------
Variant: releaseUnitTest
Config: debug
Store: /home/daniel/.android/debug.keystore
Alias: AndroidDebugKey
MD5: 27:9D:6A:18:0F:D6:44:20:39:19:8C:95:2F:9B:0C:0F
SHA1: 52:E1:14:28:17:6A:6E:D6:81:7F:FF:2A:F4:95:39:DC:8F:E5:58:8C
SHA-256: 21:45:0B:4A:47:1D:DE:63:1B:C5:DD:1F:0D:11:99:27:F6:18:4A:90:66:1F:EE:DC:14:C9:67:A7:86:B9:53:F9
Valid until: sexta-feira, 16 de junho de 2051
----------
Variant: profileUnitTest
Config: debug
Store: /home/daniel/.android/debug.keystore
Alias: AndroidDebugKey
MD5: 27:9D:6A:18:0F:D6:44:20:39:19:8C:95:2F:9B:0C:0F
SHA1: 52:E1:14:28:17:6A:6E:D6:81:7F:FF:2A:F4:95:39:DC:8F:E5:58:8C
SHA-256: 21:45:0B:4A:47:1D:DE:63:1B:C5:DD:1F:0D:11:99:27:F6:18:4A:90:66:1F:EE:DC:14:C9:67:A7:86:B9:53:F9
Valid until: sexta-feira, 16 de junho de 2051
----------

> Task :path_provider:signingReport
Variant: debugAndroidTest
Config: debug
Store: /home/daniel/.android/debug.keystore
Alias: AndroidDebugKey
MD5: 27:9D:6A:18:0F:D6:44:20:39:19:8C:95:2F:9B:0C:0F
SHA1: 52:E1:14:28:17:6A:6E:D6:81:7F:FF:2A:F4:95:39:DC:8F:E5:58:8C
SHA-256: 21:45:0B:4A:47:1D:DE:63:1B:C5:DD:1F:0D:11:99:27:F6:18:4A:90:66:1F:EE:DC:14:C9:67:A7:86:B9:53:F9
Valid until: sexta-feira, 16 de junho de 2051
----------
Variant: debugUnitTest
Config: debug
Store: /home/daniel/.android/debug.keystore
Alias: AndroidDebugKey
MD5: 27:9D:6A:18:0F:D6:44:20:39:19:8C:95:2F:9B:0C:0F
SHA1: 52:E1:14:28:17:6A:6E:D6:81:7F:FF:2A:F4:95:39:DC:8F:E5:58:8C
SHA-256: 21:45:0B:4A:47:1D:DE:63:1B:C5:DD:1F:0D:11:99:27:F6:18:4A:90:66:1F:EE:DC:14:C9:67:A7:86:B9:53:F9
Valid until: sexta-feira, 16 de junho de 2051
----------
Variant: releaseUnitTest
Config: debug
Store: /home/daniel/.android/debug.keystore
Alias: AndroidDebugKey
MD5: 27:9D:6A:18:0F:D6:44:20:39:19:8C:95:2F:9B:0C:0F
SHA1: 52:E1:14:28:17:6A:6E:D6:81:7F:FF:2A:F4:95:39:DC:8F:E5:58:8C
SHA-256: 21:45:0B:4A:47:1D:DE:63:1B:C5:DD:1F:0D:11:99:27:F6:18:4A:90:66:1F:EE:DC:14:C9:67:A7:86:B9:53:F9
Valid until: sexta-feira, 16 de junho de 2051
----------
Variant: profileUnitTest
Config: debug
Store: /home/daniel/.android/debug.keystore
Alias: AndroidDebugKey
MD5: 27:9D:6A:18:0F:D6:44:20:39:19:8C:95:2F:9B:0C:0F
SHA1: 52:E1:14:28:17:6A:6E:D6:81:7F:FF:2A:F4:95:39:DC:8F:E5:58:8C
SHA-256: 21:45:0B:4A:47:1D:DE:63:1B:C5:DD:1F:0D:11:99:27:F6:18:4A:90:66:1F:EE:DC:14:C9:67:A7:86:B9:53:F9
Valid until: sexta-feira, 16 de junho de 2051
----------

```

### Salvar o google-service.json

* Baixe o arquivo "google-service.json"
* Salve em "./android/app/"

## Inicializar o firebase no aplicativo

* [Link de referencia](https://firebase.flutter.dev/docs/overview/)

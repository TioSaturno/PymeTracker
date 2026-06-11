# Flow API | Flow

[Saltar al contenido principal](#__docusaurus_skipToContent_fallback)

![logo](https://www.flow.cl/images/header/logo-flow.svg)

- Introducción
  - Versionamiento
  - Acceso al API
  - Autenticación y Seguridad
  - ¿Cómo firmar con su SecretKey?
  - Consumiendo servicios método GET
  - Consumiendo servicios método POST
  - Notificaciones de Flow a su comercio
  - Códigos de error de intentos de pago
  - Paginación
  - Clientes API
  - Postman
  - Realizar pruebas en nuestro ambiente Sandbox
- payment
  - getObtiene el estado de una orden de pago.
  - getObtiene el estado de un pago en base al commerceId
  - getObtiene el estado de un pago en base al número de orden Flow
  - getObtiene el listado de pagos recibidos en un día
  - getObtiene el estado extendido de una orden de pago.
  - getObtiene el estado extendido de un pago en base al número de orden Flow
  - getObtiene el listado de transacciones realizadas en un día
  - postGenera una orden de pago
  - postGenera un cobro por email
- refund
  - postPermite crear un reembolso
  - postPermite cancelar un reembolso
  - getObtiene el estado de un reemboso.
- customer
  - postCrear un cliente
  - postEdita un cliente
  - postEliminar un cliente
  - getObtiene los datos de un cliente
  - getLista de clientes
  - postEnvía a un cliente a registrar su tarjeta de crédito
  - getResultado de registro de tarjeta de crédito de un cliente
  - postElimina el registro de la tarjeta de crédito de un cliente
  - postEfectúa un cargo en la tarjeta de crédito un cliente
  - postEnvía un cobro a un cliente.
  - postEnvía de forma masiva un lote de cobros a clientes.
  - getObtiene el estado de un lote de cobros enviados por el servicio batchCollect
  - postReversa un cargo efectuado en la tarjeta de crédito de un cliente
  - getLista paginada de los cargos efectuados a un cliente
  - getLista paginada de intentos de cargos fallidos a un cliente
  - getLista paginada de suscripciones de un cliente
- plans
  - postCrea un Plan de Suscripción
  - getObtiene los datos de un Plan de Suscripción
  - postEdita un Plan de Suscripción
  - postElimina un Plan de Suscripción
  - getLista paginada de planes de suscripción
- subscription
  - postCrea una nueva suscripción a un Plan
  - getObtiene una Suscripción en base al subscriptionId
  - getObtiene la lista de suscripciones para un Plan
  - postModifica los días de Trial de una suscripción
  - postCancela una suscripción
  - postAgrega un descuento a la suscripción
  - postElimina un descuento a la suscripción
  - postAgrega un item adicional a la suscripción
  - postElimina un item adicional a la suscripción
  - postCambia el plan asociado a una suscripción
  - postPrevisualiza el cambio de plan asociado a una suscripción
  - postCancela un cambio de plan programado asociado a una suscripción
- subscription_items
  - postCrea un item adicional de suscripción
  - getObtiene un item adicional de suscripción
  - postEdita un item adicional de suscripción
  - postElimina un item adicional de suscripción
  - getLista los items adicionales de suscripción
- coupon
  - postCrea un cupón de descuento
  - postEdita un cupón de descuento
  - postElimina un cupón de descuento
  - getObtiene un cupón de descuento
  - getLista los cupones de descuento
- invoice
  - getObtiene los datos de un Invoice (Importe)
  - postCancela un Importe (Invoice) pendiente de pago
  - postIngresa un pago por fuera y da por pagado el Importe (Invoice)
  - getObtiene los invoices vencidos
  - postReintenta el cobro de un invoice vencido
- settlement
  - getObtiene la liquidación efectuada para esa fecha.
  - getObtiene la Liquidación efectuada con ese identificador
  - getBusca liquidaciones en el un determinado rango de fechas.
  - getObtiene la liquidación efectuada con ese identificador en el formato nuevo
- merchant
  - postCrea un comercio asociado
  - postEdita un comercio asociado
  - postElimina un comercio asociado
  - getObtener comercio asociado
  - getLista de comercios asociados

[![redocly logo](https://cdn.redoc.ly/redoc/logo-mini.svg)API docs by Redocly](https://redocly.com/redoc/)

# Flow API (3.0.1)

Download OpenAPI specification:[Download](https://developers.flow.cl/es-openApiFlow.yaml)

E-mail: [soporte@flow.cl](mailto:soporte@flow.cl) License: [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0.html) [Terms of Service](https://www.flow.cl/terminos.php)

# [](#section/Introduccion)Introducción

Bienvenido a la documentación de referencia del **API REST** de Flow! [REST](http://en.wikipedia.org/wiki/REST_API) es un protocolo de servicio web que se presta para un desarrollo rápido mediante el uso de la tecnología HTTP y JSON.

La API REST de Flow proporciona un amplio conjunto de operaciones y recursos para:

- Payments (Pagos)
- Customer (Clientes, cobros, cargos automáticos)
- Refunds (Reembolsos)
- Subscriptions (Suscripciones, cobros recurrentes)
- Subscriptions Items (Items adicionales de suscripciones)
- Coupons (Cupones de descuento para subscripciones)
- Settlement (Liquidaciones de pagos, reembolsos y comisiones,)
- Merchants (Gestión de comercios asociados)

## [](#section/Introduccion/Versionamiento)Versionamiento

La API se encuentra en constante crecimiento, añadiendo nuevos servicios y/o mejorando funcionalidades existentes para que nuestros clientes puedan sacar el mayor provecho posible a sus integraciones. Por lo mismo, cada vez que se hacen cambios en la API se considera que son **compatibles con la versiones anteriores**.

Ahora bien, FLOW considera los siguientes cambios como compatibles con versiones anteriores:

- Añadir nuevos servicios
- Añadir nuevos parámetros opcionales a servicios existentes
- Añadir nuevas propiedades a respuestas de servicios existentes
- Modificar el orden de las propiedades en respuestas existentes

Debido a lo anterior es que instamos a nuestros clientes a que consideren estos aspectos en sus integraciones, para evitar inconvenientes con nuevas versiones.

Para más información en relación a los cambios pueden revisar el [API changelog](api_changelog.txt) y suscribirse a nuestra [lista de correos](https://groups.google.com/d/forum/api-list-flow-cl) para enterarse de anuncios de la API.

## [](#section/Introduccion/Acceso-al-API)Acceso al API

SI tienes una cuenta en Flow, puedes acceder al API REST mediante los siguientes endpoints:

Site

Base URL for Rest Endpoints

Production

https://www.flow.cl/api

Sandbox

https://sandbox.flow.cl/api

El endpoint de Producción proporciona acceso directo para generar transacciones reales. El endpoint Sandbox permite probar su integración sin afectar los datos reales.

## [](#section/Introduccion/Autenticacion-y-Seguridad)Autenticación y Seguridad

El API soporta como método de autenticación el **APIKey** y como seguridad, los datos que usted envíe siempre deberían estar firmado con su **SecretKey**. De esta forma, Flow verifica que los datos enviados le pertenecen y que no fueron adulterados durante la transmisión de red. Además, los datos viajan encriptados con un canal seguro mediante **SSL.**

Tanto su ApiKey como su SecretKey se obtienen desde su cuenta de Flow:

Sitio

Mi cuenta Flow

Production

[https://www.flow.cl/app/web/misDatos.php](https://www.flow.cl/app/web/misDatos.php)

Sandbox

[https://sandbox.flow.cl/app/web/misDatos.php](https://sandbox.flow.cl/app/web/misDatos.php)

## [](#section/Introduccion/Como-firmar-con-su-SecretKey)¿Cómo firmar con su SecretKey?

Se deben firmar todos los parámetros menos el parámetro **s** que es donde va la firma. Primero se deben ordenar los parámetros de forma alfabética ascendente en base al nombre del parámetro.

Una vez ordenados, se deben concatenar en un string los parámetros de la siguiente forma:

Nombre_del_parametro **valor** nombre_del_parametro **valor**.

**Ejemplo:**

Si sus parámetros son:

- "apiKey" = "XXXX-XXXX-XXXX"
- "currency" = "CLP"
- "amount" = 5000

El string ordenado para firmar deberia ser:

**"amount5000apiKeyXXXX-XXXX-XXXXcurrencyCLP"**

El string concatenado se debe firmar con la función **hmac** utilizando el algoritmo **sha256** y su **secretKey** como llave.

### Ejemplo PHP

Ordenando los parámetros:

```php
$params = array(
  "apiKey" => "1F90971E-8276-4715-97FF-2BLG5030EE3B,
  "token" = "AJ089FF5467367"
);
$keys = array_keys($params);
sort($keys);
```

Concatenando:

```php
$toSign = "";
foreach($keys as $key) {
  $toSign .= $key . $params[$key];
};
```

Firmando:

```php
$signature = hash_hmac('sha256', $toSign , $secretKey);
```

### Ejemplos de firmado:

**PHP:**

```php
$sign = hash_hmac('sha256', $string_to_sign, $secretKey);
```

**Java:**

```java
String sign = hmacSHA256(secretKey, string_to_sign);
```

**Ruby:**

```ruby
OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new('sha256'),secret_key,string_to_sign);
```

**Javascript:**

```javascript
var sign = CryptoJS.HmacSHA256(stringToSign, secretKey);
```

## [](#section/Introduccion/Consumiendo-servicios-metodo-GET)Consumiendo servicios método GET

Una vez obtenida la firma de los parámetros, agregue al resto de los parámetros el parámetro **s** con el valor del hash obtenido en el proceso de firma.

### Ejemplo PHP:

```php
$url = 'https://www.flow.cl/api';
// Agrega a la url el servicio a consumir
$url = $url . '/payment/getStatus';
// agrega la firma a los parámetros
$params["s"] = $signature;
//Codifica los parámetros en formato URL y los agrega a la URL
$url = $url . "?" . http_build_query($params);
try {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    $response = curl_exec($ch);
    if($response === false) {
      $error = curl_error($ch);
      throw new Exception($error, 1);
    }
    $info = curl_getinfo($ch);
    if(!in_array($info['http_code'], array('200', '400', '401')) {
      throw new Exception('Unexpected error occurred. HTTP_CODE: '.$info['http_code'] , $info['http_code']);
    }
    echo $response;
    } catch (Exception $e) {
      echo 'Error: ' . $e->getCode() . ' - ' . $e->getMessage();
    }
```

## [](#section/Introduccion/Consumiendo-servicios-metodo-POST)Consumiendo servicios método POST

Una vez obtenida la firma de los parámetros, agregue al resto de los parámetros el parámetro **s** con el valor del hash obtenido en el proceso de firma.

### Ejemplo PHP:

```php
$url = 'https://www.flow.cl/api';
// Agrega a la url el servicio a consumir
$url = $url . '/payment/create';
//Agrega la firma a los parámetros
$params["s"] = $signature;
try {
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
  curl_setopt($ch, CURLOPT_POST, TRUE);
  curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
  $response = curl_exec($ch);
  if($response === false) {
    $error = curl_error($ch);
    throw new Exception($error, 1);
  }
  $info = curl_getinfo($ch);
  if(!in_array($info['http_code'], array('200', '400', '401')) {
    throw new Exception('Unexpected error occurred. HTTP_CODE: '.$info['http_code'] , $info['http_code']);
  }
  echo $response;
} catch (Exception $e) {
  echo 'Error: ' . $e->getCode() . ' - ' . $e->getMessage();
}
```

## [](#section/Introduccion/Notificaciones-de-Flow-a-su-comercio)Notificaciones de Flow a su comercio

Para todas las transaciones asíncronas **Flow** envía a su comercio notificaciones a sus páginas de callback, por medio de request via **POST**, content-type: **application/x-www-form-urlencoded**, enviando como parámetro un **token**, con este token el comercio debe invocar el servicio correspondiente que responde con los datos. Por ejemplo: Para crear un pago, en el servicio **payment/create** el comercio envía como uno de los parámetros **urlConfirmation**, que corresponde a la url donde **Flow** notificará el estado del pago. En esta página, el comercio recibirá el **token** y deberá invocar el servicio **payment/getStatus** para obtener el resultado del pago.

### Transacciones asíncronas:

Servicio

Url callback

Método para obtener el resultado

payment/create

urlConfirmation

payment/getStatus

payment/createEmail

urlConfirmation

payment/getStatus

refund/create

urlCallback

refund/getStatus

customer/register

url_return

customer/getRegisterStatus

customer/collect

urlConfirmation

payment/getStatus

customer/batchCollect

urlCallback

customer/getBatchCollectStatus

customer/batchCollect

urlConfirmation

payment/getStatus

## [](#section/Introduccion/Codigos-de-error-de-intentos-de-pago)Códigos de error de intentos de pago

Al utilizar los servicios extendidos **payment/getStatusExtended** y **payment/getStatusByFlowOrderExtended** se puede obtener la información de error en el último intento de pago. Los códigos existentes son:

Código

Descripción

\-1

Tarjeta inválida

\-11

Excede límite de reintentos de rechazos

\-2

Error de conexión

\-3

Excede monto máximo

\-4

Fecha de expiración inválida

\-5

Problema en autenticación

\-6

Rechazo general

\-7

Tarjeta bloqueada

\-8

Tarjeta vencida

\-9

Transacción no soportada

\-10

Problema en la transacción

999

Error desconocido

## [](#section/Introduccion/Paginacion)Paginación

Todos los servicios cuyo resultado son listas **Flow** entrega los resultados paginados. La cantidad de registros por página y la navegación por las distintas páginas se controlan con los siguientes parámetros:

Parámetro

Descripción

start

número de registro de inicio de la página. Si se omite el valor por omisión es 0.

limit

número de registros por página. Si se omite el valor por omisón es 10. El valor máximo es de 100 registros por página.

Todos los servicios de paginación retornan un objeto JSON con los siguientes datos:

```
{
  "total": número de registros totales,
  "hasMore": 1 Si hay más páginas, 0 si no hay,
  "data": [{}] arreglo con los registros
}
```

Para recorrer las páginas, si como resultado **hasMore** es 1, entonces suma el valor del parámetro **limit** al parámetro **start** y vuelve a invocar el servicio hasta que **hasMore** retorne 0

## [](#section/Introduccion/Clientes-API)Clientes API

Disponemos de los siguientes clientes API Rest que facilitan la integración con Flow:

Lenguage

URL de descarga

PHP

[https://github.com/flowcl/PHP-API-CLIENT](https://github.com/flowcl/PHP-API-CLIENT)

## [](#section/Introduccion/Postman)Postman

Disponemos de Collections de Postman para probar el consumo de los distintos servicios del API. Estas colecciones están agrupadas por funcionalidades y vienen con el algoritmo de firmado pre-programado.

**¿Que es Postman?** Postman es una herramienta que permite crear peticiones sobre APIs de una forma muy sencilla y poder, de esta manera, probar las APIs

Puede descargar Postman aquí: [Postman download](https://www.getpostman.com/downloads/)

Para utilizarlos, deberá crear **Environment** con las siguientes variables de ambiente:

- apiKey: apiKey obtenida de su cuenta Flow
- secretKey: secretKey obtenida de su cuenta Flow
- Hosting: **sandbox.flow.cl** para ambiente sandbox o **[www.flow.cl](http://www.flow.cl)** para ambiente productivo.

Puede descargar los archivos Collections para Postman aquí:

Collection

URL de descarga

Flow Payment

[Flow Payment.postman\_collection.json](Flow Payment.postman_collection.json)

Flow Customer

[Flow Customer.postman\_collection.json](Flow Customer.postman_collection.json)

Flow Plans

[Flow Plans.postman\_collection.json](Flow Plans.postman_collection.json)

Flow Subscription

[Flow Subscription.postman\_collection.json](Flow Subscription.postman_collection.json)

Flow Coupon

[Flow Coupon.postman\_collection.json](Flow Coupon.postman_collection.json)

Flow Invoices

[Flow Invoices.postman\_collection.json](Flow Invoices.postman_collection.json)

Flow Refund

[Flow Refund.postman\_collection.json](Flow Refund.postman_collection.json)

Flow Settlements

[Flow Settlements.postman\_collection.json](Flow Settlements.postman_collection.json)

Flow Merchant

[Flow Merchant.postman\_collection.json](Flow Merchant.postman_collection.json)

## [](#section/Introduccion/Realizar-pruebas-en-nuestro-ambiente-Sandbox)Realizar pruebas en nuestro ambiente Sandbox

Puede realizar pruebas en nuestro ambiente Sandbox para los distintos medios de pagos.

### Tarjetas de prueba Chile

Dato

Valor

N° tarjeta de crédito

4051885600446623

Año de expiración

Cualquiera

Mes de expiración

Cualquiera

CVV

123

### En la simulación del banco usar:

Dato

Valor

Rut

11111111-1

Clave

123

### Para los medios de pago:

- Servipag
- Multicaja
- Mach
- Cryptocompra

Se presentan simuladores de pago, donde sólo debe hacer clic en el botón aceptar.

### Tarjetas de prueba Perú y México

Dato

Valor

N° tarjeta de crédito

5293138086430769

Año de expiración

Cualquiera

Mes de expiración

Cualquiera

CVV

123

### Suscripciones

#### Tarjetas de prueba Perú para pagos recurrentes

##### Aceptado

Esta tarjeta de prueba permite simular la inscripción exitosa y un pago recurrente aceptado

Dato

Valor

N° tarjeta de crédito

5293138086430769

Año de expiración

Cualquiera

Mes de expiración

Cualquiera

CVV

123

Inscripción

Sí

##### Rechazado

Esta tarjeta de prueba permite simular la inscripción exitosa y un pago recurrente rechazado

Dato

Valor

N° tarjeta de crédito

4551708161768059

Año de expiración

Cualquiera

Mes de expiración

Cualquiera

CVV

123

Inscripción

Sí

# [](#tag/payment)payment

Creación de transacciones de pagos y cobros por email. Utilice el servicio **payment/create** para crear links de pagos o **payment/createEmail** para crear cobros por email.

## [](#tag/payment/paths/~1payment~1getStatus/get)Obtiene el estado de una orden de pago.

Este método se utiliza para obtener el estado de un pago. Se debe utilizar en la página callback del comercio para recibir notificaciones de pagos. Cada vez que el pagador efectúe un pago, **Flow** enviará vía POST una llamada a la página del comercio, pasando como parámetro un **token** que deberá utilizarse en este servicio.

##### query Parameters

apiKey

required

string

apiKey del comercio

token

required

string

token de la transacción enviado por Flow

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

El objeto PaymentStatus

**400**

error del Api

**401**

error interno de negocio

get/payment/getStatus

Production server (uses live data)

https://www.flow.cl/api/payment/getStatus

Sandbox server (uses test data)

https://sandbox.flow.cl/api/payment/getStatus

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

Expand all Collapse all

`{  -   "flowOrder": 3567899,      -   "commerceOrder": "sf12377",      -   "requestDate": "2017-07-21 12:32:11",      -   "status": 1,      -   "subject": "game console",      -   "currency": "CLP",      -   "amount": 12000,      -   "payer": "pperez@gamil.com",      -   "optional": {          -   "RUT": "7025521-9",              -   "ID": "899564778"                   },      -   "pending_info": {          -   "media": "Multicaja",              -   "date": "2017-07-21 10:30:12"                   },      -   "paymentData": {          -   "date": "2017-07-21 12:32:11",              -   "media": "webpay",              -   "conversionDate": "2017-07-21",              -   "conversionRate": 1.1,              -   "amount": 12000,              -   "currency": "CLP",              -   "fee": 551,              -   "balance": 11499,              -   "transferDate": "2017-07-24"                   },      -   "merchantId": "string"       }`

## [](#tag/payment/paths/~1payment~1getStatusByCommerceId/get)Obtiene el estado de un pago en base al commerceId

Este método permite obtener el estado de un pago en base al **commerceId**

##### query Parameters

apiKey

required

string

apiKey del comercio

commerceId

required

string

Orden del comercio

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

El objeto PaymentStatus

**400**

error del Api

**401**

error interno de negocio

get/payment/getStatusByCommerceId

Production server (uses live data)

https://www.flow.cl/api/payment/getStatusByCommerceId

Sandbox server (uses test data)

https://sandbox.flow.cl/api/payment/getStatusByCommerceId

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

Expand all Collapse all

`{  -   "flowOrder": 3567899,      -   "commerceOrder": "sf12377",      -   "requestDate": "2017-07-21 12:32:11",      -   "status": 1,      -   "subject": "game console",      -   "currency": "CLP",      -   "amount": 12000,      -   "payer": "pperez@gamil.com",      -   "optional": {          -   "RUT": "7025521-9",              -   "ID": "899564778"                   },      -   "pending_info": {          -   "media": "Multicaja",              -   "date": "2017-07-21 10:30:12"                   },      -   "paymentData": {          -   "date": "2017-07-21 12:32:11",              -   "media": "webpay",              -   "conversionDate": "2017-07-21",              -   "conversionRate": 1.1,              -   "amount": 12000,              -   "currency": "CLP",              -   "fee": 551,              -   "balance": 11499,              -   "transferDate": "2017-07-24"                   },      -   "merchantId": "string"       }`

## [](#tag/payment/paths/~1payment~1getStatusByFlowOrder/get)Obtiene el estado de un pago en base al número de orden Flow

Este método permite obtener el estado de un pago en base al **flowOrder**

##### query Parameters

apiKey

required

string

apiKey del comercio

flowOrder

required

number

Example: flowOrder=68977654

número de orden Flow

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

El objeto PaymentStatus

**400**

error del Api

**401**

error interno de negocio

get/payment/getStatusByFlowOrder

Production server (uses live data)

https://www.flow.cl/api/payment/getStatusByFlowOrder

Sandbox server (uses test data)

https://sandbox.flow.cl/api/payment/getStatusByFlowOrder

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

Expand all Collapse all

`{  -   "flowOrder": 3567899,      -   "commerceOrder": "sf12377",      -   "requestDate": "2017-07-21 12:32:11",      -   "status": 1,      -   "subject": "game console",      -   "currency": "CLP",      -   "amount": 12000,      -   "payer": "pperez@gamil.com",      -   "optional": {          -   "RUT": "7025521-9",              -   "ID": "899564778"                   },      -   "pending_info": {          -   "media": "Multicaja",              -   "date": "2017-07-21 10:30:12"                   },      -   "paymentData": {          -   "date": "2017-07-21 12:32:11",              -   "media": "webpay",              -   "conversionDate": "2017-07-21",              -   "conversionRate": 1.1,              -   "amount": 12000,              -   "currency": "CLP",              -   "fee": 551,              -   "balance": 11499,              -   "transferDate": "2017-07-24"                   },      -   "merchantId": "string"       }`

## [](#tag/payment/paths/~1payment~1getPayments/get)Obtiene el listado de pagos recibidos en un día

Este método permite obtener la lista paginada de pagos recibidos en un día.Los objetos pagos de la lista tienen la misma estructura de los retornados en los servicios payment/getStatus

##### query Parameters

apiKey

required

string

apiKey del comercio

date

required

string

fecha de los pagos en formato yyyy-mm-dd

start

integer

Número de registro de inicio de la página. Si se omite el valor por omisión es 0.

limit

integer

Número de registros por página. Si se omite el valor por omisón es 10. El valor máximo es de 100 registros por página.

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

Lista paginada de pagos

**400**

Error del Api

**401**

Error de negocio

get/payment/getPayments

Production server (uses live data)

https://www.flow.cl/api/payment/getPayments

Sandbox server (uses test data)

https://sandbox.flow.cl/api/payment/getPayments

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "total": 200,      -   "hasMore": 1,      -   "data": "[{item list 1}{item list 2}{item list n..}"       }`

## [](#tag/payment/paths/~1payment~1getStatusExtended/get)Obtiene el estado extendido de una orden de pago.

Este método se utiliza para obtener el estado de un pago. A diferencia del /payment/getStatus este servicio retorna el tipo de pago, los 4 últimos dígitos de la tarjeta, el BIN y últimos 4 dígitos de la tarjeta en el campo `cardNumber`, y la información del último intento de pago. Se debe utilizar en la página callback del comercio para recibir notificaciones de pagos. Cada vez que el pagador efectúe un pago, **Flow** enviará vía POST una llamada a la página del comercio, pasando como parámetro un **token** que deberá utilizarse en este servicio.

##### query Parameters

apiKey

required

string

apiKey del comercio

token

required

string

token de la transacción enviado por Flow

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

El objeto PaymentStatusExtended

**400**

error del Api

**401**

error interno de negocio

get/payment/getStatusExtended

Production server (uses live data)

https://www.flow.cl/api/payment/getStatusExtended

Sandbox server (uses test data)

https://sandbox.flow.cl/api/payment/getStatusExtended

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

Expand all Collapse all

`{  -   "flowOrder": 3567899,      -   "commerceOrder": "sf12377",      -   "requestDate": "2017-07-21 12:32:11",      -   "status": 1,      -   "subject": "game console",      -   "currency": "CLP",      -   "amount": 12000,      -   "payer": "pperez@gamil.com",      -   "optional": {          -   "RUT": "7025521-9",              -   "ID": "899564778"                   },      -   "pending_info": {          -   "media": "Multicaja",              -   "date": "2017-07-21 10:30:12"                   },      -   "paymentData": {          -   "date": "2017-07-21 12:32:11",              -   "media": "webpay",              -   "conversionDate": "2017-07-21",              -   "conversionRate": 1.1,              -   "amount": 12000,              -   "currency": "CLP",              -   "fee": 551,              -   "balance": 11499,              -   "transferDate": "2017-07-24",              -   "mediaType": "Crédito",              -   "cardLast4Numbers": "9876",              -   "cardNumber": "457630 **** **** 9876",              -   "taxes": 1,              -   "installments": 3,              -   "autorizationCode": "123456"                   },      -   "merchantId": "string",      -   "lastError": {          -   "code": "01",              -   "message": "Tarjeta inválida",              -   "medioCode": "005"                   }       }`

## [](#tag/payment/paths/~1payment~1getStatusByFlowOrderExtended/get)Obtiene el estado extendido de un pago en base al número de orden Flow

Este método permite obtener el estado de un pago en base al **flowOrder**. A diferencia del /payment/getStatusByFlowOrder este servicio retorna el tipo de pago, los 4 últimos dígitos de la tarjeta (si el pago se hizo con tarjeta) y la información del último intento de pago.

##### query Parameters

apiKey

required

string

apiKey del comercio

flowOrder

required

number

Example: flowOrder=68977654

número de orden Flow

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

El objeto PaymentStatusExtended

**400**

error del Api

**401**

error interno de negocio

get/payment/getStatusByFlowOrderExtended

Production server (uses live data)

https://www.flow.cl/api/payment/getStatusByFlowOrderExtended

Sandbox server (uses test data)

https://sandbox.flow.cl/api/payment/getStatusByFlowOrderExtended

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

Expand all Collapse all

`{  -   "flowOrder": 3567899,      -   "commerceOrder": "sf12377",      -   "requestDate": "2017-07-21 12:32:11",      -   "status": 1,      -   "subject": "game console",      -   "currency": "CLP",      -   "amount": 12000,      -   "payer": "pperez@gamil.com",      -   "optional": {          -   "RUT": "7025521-9",              -   "ID": "899564778"                   },      -   "pending_info": {          -   "media": "Multicaja",              -   "date": "2017-07-21 10:30:12"                   },      -   "paymentData": {          -   "date": "2017-07-21 12:32:11",              -   "media": "webpay",              -   "conversionDate": "2017-07-21",              -   "conversionRate": 1.1,              -   "amount": 12000,              -   "currency": "CLP",              -   "fee": 551,              -   "balance": 11499,              -   "transferDate": "2017-07-24",              -   "mediaType": "Crédito",              -   "cardLast4Numbers": "9876",              -   "cardNumber": "457630 **** **** 9876",              -   "taxes": 1,              -   "installments": 3,              -   "autorizationCode": "123456"                   },      -   "merchantId": "string",      -   "lastError": {          -   "code": "01",              -   "message": "Tarjeta inválida",              -   "medioCode": "005"                   }       }`

## [](#tag/payment/paths/~1payment~1getTransactions/get)Obtiene el listado de transacciones realizadas en un día

Este método permite obtener la lista paginada de transacciones realizadas en un día. Los objetos transacción de la lista tienen la misma estructura de los retornados en los servicios payment/getStatus

##### query Parameters

apiKey

required

string

apiKey del comercio

date

required

string

fecha de los pagos en formato yyyy-mm-dd

start

integer

Número de registro de inicio de la página. Si se omite el valor por omisión es 0.

limit

integer

Número de registros por página. Si se omite el valor o este es mayor a 100 por omisión se muestran 10. El valor máximo es de 100 registros por página.

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

Lista paginada de transacciones

**400**

Error del Api

**401**

Error de negocio

get/payment/getTransactions

Production server (uses live data)

https://www.flow.cl/api/payment/getTransactions

Sandbox server (uses test data)

https://sandbox.flow.cl/api/payment/getTransactions

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "total": 200,      -   "hasMore": 1,      -   "data": "[{item list 1}{item list 2}{item list n..}"       }`

## [](#tag/payment/paths/~1payment~1create/post)Genera una orden de pago

Este método permite crear una orden de pago a **Flow** y recibe como respuesta la **URL** para redirigir el browser del pagador y el **token** que identifica la transacción. La url de redirección se debe formar concatenando los valores recibidos en la respuesta de la siguiente forma:

**url** + "?token=" +**token**

Una vez que el pagador efectúe el pago, **Flow** notificará el resultado a la página del comercio que se envió en el parámetro **urlConfirmation**.

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

commerceOrder

required

string

Orden del comercio

subject

required

string

Descripción de la orden

currency

string

Moneda de la orden

amount

required

number

Monto de la orden

email

required

string <email>

email del pagador

paymentMethod

integer

Identificador del medio de pago. Si se envía el identificador, el pagador será redireccionado directamente al medio de pago que se indique, de lo contrario Flow le presentará una página para seleccionarlo. El medio de pago debe haber sido previamente contratado. Podrá ver los identificadores de sus medios de pago en la sección "Medios de pago" ingresando a Flow con sus credenciales. Para indicar todos los medios de pago utilice el identificador:

- 9 Todos los medios

urlConfirmation

required

string <uri>

url callback del comercio donde Flow confirmará el pago

urlReturn

required

string <uri>

url de retorno del comercio donde Flow redirigirá al pagador

optional

string

Datos opcionales en formato JSON clave = valor, ejemplo: {"rut":"9999999-9","nombre":"cliente 1"}

timeout

integer

tiempo en segundos para que una orden expire después de haber sido creada. Si no se envía este parámetro la orden no expirará y estará vigente para pago por tiempo indefinido. Si envía un valor en segundos, la orden expirará x segundos después de haber sido creada y no podrá pagarse.

checkout_timeout

integer

Tiempo máximo en segundos para seleccionar un medio de pago en el checkout. Si el pagador no selecciona un medio de pago dentro de este tiempo, la orden será anulada. Si no se envía este parámetro, no se aplicará límite de tiempo en el checkout.

merchantId

string

Id de comercio asociado. Solo aplica si usted es comercio integrador.

payment_currency

string

Moneda en que se espera se pague la orden

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

url y token para redirigir el browser del pagador La url de redirección se debe formar concatenando los valores recibidos en la respuesta de la siguiente forma:

**url** + "?token=" +**token**

**400**

Error del Api

**401**

Error de negocio

### Callbacks

post{$request#/urlConfirmation}

post/payment/create

Production server (uses live data)

https://www.flow.cl/api/payment/create

Sandbox server (uses test data)

https://sandbox.flow.cl/api/payment/create

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "url": "[https://api.flow.cl](https://api.flow.cl)",      -   "token": "33373581FC32576FAF33C46FC6454B1FFEBD7E1H",      -   "flowOrder": 8765456       }`

## [](#tag/payment/paths/~1payment~1createEmail/post)Genera un cobro por email

Permite generar un cobro por email. **Flow** emite un email al pagador que contiene la información de la Orden de pago y el link de pago correspondiente. Una vez que el pagador efectúe el pago, **Flow** notificará el resultado a la página del comercio que se envió en el parámetro **urlConfirmation**.

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

commerceOrder

required

string

Orden del comercio

subject

required

string

Descripción de la orden

currency

string

Moneda de la orden

amount

required

number

Monto de la orden

email

required

string <email>

email del pagador

urlConfirmation

required

string <uri>

url callbak del comercio donde Flow confirmará el pago

urlReturn

required

string <uri>

url de retorno del comercio donde Flow redirigirá al pagador

forward_days_after

number

Número de días posteriores al envío del cobro para enviar una nueva notificación de persistencia si la orden no está pagada.

forward_times

number

Número de veces de envío de mail de persistencia.

optional

string

Datos opcionales en formato JSON clave = valor, ejemplo: {"rut":"9999999-9","nombre":"cliente 1"}

timeout

integer

tiempo en segundos para que una orden expire después de haber sido creada. Si no se envía este parámetro la orden no expirará y estará vigente para pago por tiempo indefinido. Si envía un valor en segundos, la orden expirará x segundos después de haber sido creada y no podrá pagarse.

checkout_timeout

integer

Tiempo máximo en segundos para seleccionar un medio de pago en el checkout. Si el pagador no selecciona un medio de pago dentro de este tiempo, la orden será anulada. Si no se envía este parámetro, no se aplicará límite de tiempo en el checkout.

merchantId

string

Id de comercio asociado. Solo aplica si usted es comercio integrador.

payment_currency

string

Moneda en que se espera se pague la orden

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

Al crear un cobro por email, Flow enviará el email directamente al pagador con un link de pago. El link de pago se forma concatenando los valores recibidos en la respuesta de la siguiente forma:

**url** + "?token=" +**token**

**400**

Error del api

**401**

Error de negocio

post/payment/createEmail

Production server (uses live data)

https://www.flow.cl/api/payment/createEmail

Sandbox server (uses test data)

https://sandbox.flow.cl/api/payment/createEmail

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "url": "[https://api.flow.cl](https://api.flow.cl)",      -   "token": "33373581FC32576FAF33C46FC6454B1FFEBD7E1H",      -   "flowOrder": 8765456       }`

# [](#tag/refund)refund

Permite generar reembolsos y obtener el estado de estos.

## [](#tag/refund/paths/~1refund~1create/post)Permite crear un reembolso

Este servicio permite crear una orden de reembolso. Una vez que el receptor del reembolso acepte o rechaze el reembolso, **Flow** notificará vía POST a la página del comercio identificada en **urlCallback** pasando como parámetro **token**

En esta página, el comercio debe invocar el servicio **refund/getStatus** para obtener el estado del reembolso.

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

refundCommerceOrder

required

string

La orden de reembolso del comercio

receiverEmail

required

string

Email del receptor del reembolso

amount

required

number

Monto del reembolso

urlCallBack

required

string

La url callback del comercio donde Flow comunica el estado del reembolso

commerceTrxId

string

Identificador del comercio de la transacción original que se va reembolsar

flowTrxId

string

Identificador de Flow de la transacción original que se va reembolsar.

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

El objeto RefundStatus

**400**

Error del Api

**401**

Error de negocio

post/refund/create

Production server (uses live data)

https://www.flow.cl/api/refund/create

Sandbox server (uses test data)

https://sandbox.flow.cl/api/refund/create

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "token": "C93B4FAD6D63ED9A3F25D21E5D6DD0105FA8CAAQ",      -   "flowRefundOrder": "122767",      -   "date": "2017-07-21 12:33:15",      -   "status": "created",      -   "amount": "12000.00",      -   "fee": "240.00"       }`

## [](#tag/refund/paths/~1refund~1cancel/post)Permite cancelar un reembolso

Este servicio permite cancelar una orden de reembolso pendiente

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

token

required

string

El token devuelto al crear el reembolso

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

El objeto RefundStatus

**400**

Error del Api

**401**

Error de negocio

post/refund/cancel

Production server (uses live data)

https://www.flow.cl/api/refund/cancel

Sandbox server (uses test data)

https://sandbox.flow.cl/api/refund/cancel

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "token": "C93B4FAD6D63ED9A3F25D21E5D6DD0105FA8CAAQ",      -   "flowRefundOrder": "122767",      -   "date": "2017-07-21 12:33:15",      -   "status": "created",      -   "amount": "12000.00",      -   "fee": "240.00"       }`

## [](#tag/refund/paths/~1refund~1getStatus/get)Obtiene el estado de un reemboso.

Permite obtener el estado de un reembolso solicitado. Este servicio se debe invocar desde la página del comercio que se señaló en el parámetro **urlCallback** del servicio **refund/create**.

##### query Parameters

apiKey

required

string

apiKey del comercio

token

required

string

token de la solicitud de reembolso enviado por Flow

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

El objeto RefundStatus

**400**

Error del Api

**401**

Error de negocio

get/refund/getStatus

Production server (uses live data)

https://www.flow.cl/api/refund/getStatus

Sandbox server (uses test data)

https://sandbox.flow.cl/api/refund/getStatus

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "token": "C93B4FAD6D63ED9A3F25D21E5D6DD0105FA8CAAQ",      -   "flowRefundOrder": "122767",      -   "date": "2017-07-21 12:33:15",      -   "status": "created",      -   "amount": "12000.00",      -   "fee": "240.00"       }`

# [](#tag/customer)customer

Permite crear clientes para efectuarles cargos recurrentes o suscribirlos a un planes de suscripción. Una vez creado un cliente, **Flow** lo identificará por un hash denominado **customerId**, ejemplo:

**customerId**: cus_onoolldvec

## [](#tag/customer/paths/~1customer~1create/post)Crear un cliente

Permite crear un nuevo cliente. El servicio retorna el objeto cliente creado.

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

name

required

string

Nombre del cliente (nombre y apellido)

email

required

string

Email del cliente

externalId

required

string

Identificador externo del cliente, es decir, el identificador con el que su sistema lo reconoce.

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

El objeto Customer

**400**

error del Api

**401**

error de negocio

post/customer/create

Production server (uses live data)

https://www.flow.cl/api/customer/create

Sandbox server (uses test data)

https://sandbox.flow.cl/api/customer/create

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "customerId": "cus_onoolldvec",      -   "created": "2017-07-21 12:33:15",      -   "email": "customer@gmail.com",      -   "name": "Pedro Raul Perez",      -   "pay_mode": "string",      -   "creditCardType": "Visa",      -   "last4CardDigits": "4425",      -   "externalId": "14233531-8",      -   "status": "1",      -   "registerDate": "2017-07-21 14:22:01"       }`

## [](#tag/customer/paths/~1customer~1edit/post)Edita un cliente

Este servicio permite editar los datos de un cliente

##### Request Body schema: application/x-www-form-urlencoded

Los campos: name, email y externalId son opcionales. Si desea modificar solo el nombre, envíe solo en campo name.

apiKey

required

string

apiKey del comercio

customerId

required

string

Identificador del cliente

name

string

Nombre del cliente

email

string

Email del cliente

externalId

string

Identificador externo del cliente, es decir, el identificador con el que su sistema lo reconoce.

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

El objeto cliente

**400**

Error del Api

**401**

Error de negocio

post/customer/edit

Production server (uses live data)

https://www.flow.cl/api/customer/edit

Sandbox server (uses test data)

https://sandbox.flow.cl/api/customer/edit

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "customerId": "cus_onoolldvec",      -   "created": "2017-07-21 12:33:15",      -   "email": "customer@gmail.com",      -   "name": "Pedro Raul Perez",      -   "pay_mode": "string",      -   "creditCardType": "Visa",      -   "last4CardDigits": "4425",      -   "externalId": "14233531-8",      -   "status": "1",      -   "registerDate": "2017-07-21 14:22:01"       }`

## [](#tag/customer/paths/~1customer~1delete/post)Eliminar un cliente

Permite eliminar un cliente. Para eliminar un cliente, este no debe tener suscripciones activas o importes pendientes de pago.

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

customerId

required

string

Identificador del cliente

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

El objeto cliente

**400**

Error del Api

**401**

Error de negocio

post/customer/delete

Production server (uses live data)

https://www.flow.cl/api/customer/delete

Sandbox server (uses test data)

https://sandbox.flow.cl/api/customer/delete

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "customerId": "cus_onoolldvec",      -   "created": "2017-07-21 12:33:15",      -   "email": "customer@gmail.com",      -   "name": "Pedro Raul Perez",      -   "pay_mode": "string",      -   "creditCardType": "Visa",      -   "last4CardDigits": "4425",      -   "externalId": "14233531-8",      -   "status": "1",      -   "registerDate": "2017-07-21 14:22:01"       }`

## [](#tag/customer/paths/~1customer~1get/get)Obtiene los datos de un cliente

Permite obtener los datos de un cliente en base a su **customerId**.

##### query Parameters

apiKey

required

string

apiKey del comercio

customerId

required

string

Identificador del cliente

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

El objeto cliente

**400**

Error del Api

**401**

Error de negocio

get/customer/get

Production server (uses live data)

https://www.flow.cl/api/customer/get

Sandbox server (uses test data)

https://sandbox.flow.cl/api/customer/get

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "customerId": "cus_onoolldvec",      -   "created": "2017-07-21 12:33:15",      -   "email": "customer@gmail.com",      -   "name": "Pedro Raul Perez",      -   "pay_mode": "string",      -   "creditCardType": "Visa",      -   "last4CardDigits": "4425",      -   "externalId": "14233531-8",      -   "status": "1",      -   "registerDate": "2017-07-21 14:22:01"       }`

## [](#tag/customer/paths/~1customer~1list/get)Lista de clientes

Permite obtener la lista de clientes paginada de acuerdo a los parámetros de paginación. Además, se puede definir los siguientes filtros:

- filter: filtro por nombre del cliente
- status: filtro por estado del cliente

##### query Parameters

apiKey

required

string

apiKey del comercio

start

integer

Número de registro de inicio de la página. Si se omite el valor por omisión es 0.

limit

integer

Número de registros por página. Si se omite el valor por omisón es 10. El valor máximo es de 100 registros por página.

filter

string

Filtro por nombre del cliente

status

integer

Filtro por estado del cliente

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

Lista paginada de clientes

**400**

Error del Api

**401**

Error de negocio

get/customer/list

Production server (uses live data)

https://www.flow.cl/api/customer/list

Sandbox server (uses test data)

https://sandbox.flow.cl/api/customer/list

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "total": 200,      -   "hasMore": 1,      -   "data": "[{item list 1}{item list 2}{item list n..}"       }`

## [](#tag/customer/paths/~1customer~1register/post)Envía a un cliente a registrar su tarjeta de crédito

Envía a un cliente a registrar su tarjeta de crédito para poder efectuarle cargos automáticos. El servicio responde con la **URL** para redirigir el browser del pagador y el **token** que identifica la transacción. La **url** de redirección se debe formar concatenando los valores recibidos en la respuesta de la siguiente forma:

> **url** + "?token=" +**token**

Una vez redirigido el browser del cliente, Flow responderá por medio de una llamada POST a la url callback del comercio indicada en el parámetro **url_return** pasando como parámetro **token**. El comercio debe implementar una página y capturar el parámetro token enviado por Flow para luego consumir el servicio "customer/getRegisterStatus" para obtener el resultado del registro.

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

customerId

required

string

Identificador del cliente

url_return

required

string

Url de página callback donde Flow notifica el resultado del registro

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

Url y token para redireccionar el browser del cliente a registrar su tarjeta de crédito

**400**

Error del Api

**401**

Error de negocio

post/customer/register

Production server (uses live data)

https://www.flow.cl/api/customer/register

Sandbox server (uses test data)

https://sandbox.flow.cl/api/customer/register

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "url": "[https://www.flow.cl/app/customer/disclaimer.php](https://www.flow.cl/app/customer/disclaimer.php)",      -   "token": "41097C28B5BD78C77F589FE4BC59E18AC333F9EU"       }`

## [](#tag/customer/paths/~1customer~1getRegisterStatus/get)Resultado de registro de tarjeta de crédito de un cliente

Este servicio retorna el resultado del registro de la tarjeta de crédito de un cliente.

##### query Parameters

apiKey

required

string

apiKeydel comercio

token

required

string

El token enviado por Flow a su página callback.

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

Resultado del registro de tarjeta de crédito

**400**

Error del Api

**401**

Error de negocio

get/customer/getRegisterStatus

Production server (uses live data)

https://www.flow.cl/api/customer/getRegisterStatus

Sandbox server (uses test data)

https://sandbox.flow.cl/api/customer/getRegisterStatus

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "status": "1",      -   "customerId": "cus_onoolldvec",      -   "creditCardType": "Visa",      -   "last4CardDigits": "0366",      -   "cardNumber": "457630 **** **** 0366",      -   "issuerBank": "BANCO SANTANDER"       }`

## [](#tag/customer/paths/~1customer~1unRegister/post)Elimina el registro de la tarjeta de crédito de un cliente

Este servicio permite eliminar el registro de la tarjeta de crédito de un cliente. Al eliminar el registro no se podrá hacer cargos automáticos y Flow enviará un cobro por email.

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

customerId

required

string

Identificador del cliente

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

El objeto cliente

**400**

Error del Api

**401**

Error de negocio

post/customer/unRegister

Production server (uses live data)

https://www.flow.cl/api/customer/unRegister

Sandbox server (uses test data)

https://sandbox.flow.cl/api/customer/unRegister

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "customerId": "cus_onoolldvec",      -   "created": "2017-07-21 12:33:15",      -   "email": "customer@gmail.com",      -   "name": "Pedro Raul Perez",      -   "pay_mode": "string",      -   "creditCardType": "Visa",      -   "last4CardDigits": "4425",      -   "externalId": "14233531-8",      -   "status": "1",      -   "registerDate": "2017-07-21 14:22:01"       }`

## [](#tag/customer/paths/~1customer~1charge/post)Efectúa un cargo en la tarjeta de crédito un cliente

Este servicio permite efectuar un cargo automático en la tarjeta de crédito previamente registrada por el cliente. Si el cliente no tiene registrada una tarjeta el metodo retornará error.

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

customerId

required

string

Identificador del cliente

amount

required

number

El monto del cargo

subject

required

string

Descripción del cargo

commerceOrder

required

string

Identificador de la orden del comercio

currency

string

Moneda del cargo (CLP, UF)

optionals

string

Datos opcionales en formato JSON clave = valor, ejemplo: {"rut":"9999999-9","nombre":"cliente 1"}

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

El objeto PaymentStatus

**400**

Error del Api

**401**

Error de negocio

post/customer/charge

Production server (uses live data)

https://www.flow.cl/api/customer/charge

Sandbox server (uses test data)

https://sandbox.flow.cl/api/customer/charge

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

Expand all Collapse all

`{  -   "flowOrder": 3567899,      -   "commerceOrder": "sf12377",      -   "requestDate": "2017-07-21 12:32:11",      -   "status": 1,      -   "subject": "game console",      -   "currency": "CLP",      -   "amount": 12000,      -   "payer": "pperez@gamil.com",      -   "optional": {          -   "RUT": "7025521-9",              -   "ID": "899564778"                   },      -   "pending_info": {          -   "media": "Multicaja",              -   "date": "2017-07-21 10:30:12"                   },      -   "paymentData": {          -   "date": "2017-07-21 12:32:11",              -   "media": "webpay",              -   "conversionDate": "2017-07-21",              -   "conversionRate": 1.1,              -   "amount": 12000,              -   "currency": "CLP",              -   "fee": 551,              -   "balance": 11499,              -   "transferDate": "2017-07-24"                   },      -   "merchantId": "string"       }`

## [](#tag/customer/paths/~1customer~1collect/post)Envía un cobro a un cliente.

Este servicio envía un cobro a un cliente. Si el cliente tiene registrada una tarjeta de crédito se le hace un cargo automático, si no tiene registrada una tarjeta de credito se genera un cobro. Si se envía el parámetro byEmail = 1, se genera un cobro por email.

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

customerId

required

string

Identificador del cliente

commerceOrder

required

string

Identificador de la orden del comercio

subject

required

string

Descripción del cobro

amount

required

number

El monto del cobro

urlConfirmation

required

string <uri>

url callbak del comercio donde Flow confirmará el pago

urlReturn

required

string <uri>

url de retorno del comercio donde Flow redirigirá al pagador

currency

string

Moneda del cargo (CLP, UF)

paymentMethod

integer

Identificador del medio de pago. Si se envía el identificador, el pagador será redireccionado directamente al medio de pago que se indique, de lo contrario Flow le presentará una página para seleccionarlo. El medio de pago debe haber sido previamente contratado. Podrá ver los identificadores de sus medios de pago en la sección "Medios de pago" ingresando a Flow con sus credenciales. Para indicar todos los medios de pago utilice el identificador:

- 9 Todos los medios

byEmail

integer

Si se desea que Flow envíe cobros por email, este parámetro debe enviarse con valor 1

forward_days_after

integer

Número de días posteriores al envío del cobro para enviar una nueva notificación de persistencia si la orden no está pagada.

forward_times

integer

Número de veces de envío de mail de persistencia.

ignore_auto_charging

integer

Si se envía este parámetro con valor 1 entonces ignora el método de cargo automático aunque el cliente tenga registrada una tarjeta de crédito

optionals

string

Datos opcionales en formato JSON clave = valor, ejemplo: {"rut":"9999999-9","nombre":"cliente 1"}

timeout

integer

tiempo en segundos para que una orden expire después de haber sido creada. Si no se envía este parámetro la orden no expirará y estará vigente para pago por tiempo indefinido. Si envía un valor en segundos, la orden expirará x segundos después de haber sido creada y no podrá pagarse.

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

El objeto CollectResponse

**400**

Error del Api

**401**

Error de negocio

post/customer/collect

Production server (uses live data)

https://www.flow.cl/api/customer/collect

Sandbox server (uses test data)

https://sandbox.flow.cl/api/customer/collect

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

Expand all Collapse all

`{  -   "type": "1",      -   "commerceOrder": "zc23456",      -   "flowOrder": 0,      -   "url": "[https://api.flow.cl](https://api.flow.cl)",      -   "token": "33373581FC32576FAF33C46FC6454B1FFEBD7E1H",      -   "status": 0,      -   "paymenResult": {          -   "flowOrder": 3567899,              -   "commerceOrder": "sf12377",              -   "requestDate": "2017-07-21 12:32:11",              -   "status": 1,              -   "subject": "game console",              -   "currency": "CLP",              -   "amount": 12000,              -   "payer": "pperez@gamil.com",              -   "optional": {                  -   "RUT": "7025521-9",                      -   "ID": "899564778"                               },              -   "pending_info": {                  -   "media": "Multicaja",                      -   "date": "2017-07-21 10:30:12"                               },              -   "paymentData": {                  -   "date": "2017-07-21 12:32:11",                      -   "media": "webpay",                      -   "conversionDate": "2017-07-21",                      -   "conversionRate": 1.1,                      -   "amount": 12000,                      -   "currency": "CLP",                      -   "fee": 551,                      -   "balance": 11499,                      -   "transferDate": "2017-07-24"                               },              -   "merchantId": "string"                   }       }`

## [](#tag/customer/paths/~1customer~1batchCollect/post)Envía de forma masiva un lote de cobros a clientes.

Este servicio envía de forma masiva un lote de cobros a clientes. Similar al servicio collect pero masivo y asíncrono. Este servicio responde con un token identificador del lote y el número de filas recibidas.

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

urlCallBack

required

string <uri>

url callback del comercio donde Flow avisará cuando el lote ha sido procesado.

urlConfirmation

required

string <uri>

url callbak del comercio donde Flow confirmará el pago

urlReturn

required

string <uri>

url de retorno del comercio donde Flow redirigirá al pagador

batchRows

required

Array of objects (CollectObject)

Arreglo en formato JSON del lote de cargos CollectObject

byEmail

integer

Si se desea que Flow envíe cobros por email, este parámetro debe enviarse con valor 1

forward_days_after

integer

Número de días posteriores al envío del cobro para enviar una nueva notificación de persistencia si la orden no está pagada.

forward_times

integer

Número de veces de envío de mail de persistencia.

timeout

integer

tiempo en segundos para que una orden expire después de haber sido creada. Si no se envía este parámetro la orden no expirará y estará vigente para pago por tiempo indefinido. Si envía un valor en segundos, la orden expirará x segundos después de haber sido creada y no podrá pagarse.

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

El objeto BatchCollectResponse

**400**

Error del Api

**401**

Error de negocio

### Callbacks

post{$request#/urlCallBack}post{$request#/urlConfirmation}post{$request#/urlReturn}

post/customer/batchCollect

Production server (uses live data)

https://www.flow.cl/api/customer/batchCollect

Sandbox server (uses test data)

https://sandbox.flow.cl/api/customer/batchCollect

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

Expand all Collapse all

`{  -   "token": "33373581FC32576FAF33C46FC6454B1FFEBD7E1H",      -   "receivedRows": "112",      -   "acceptedRows": "111",      -   "rejectedRows": [          -   {                  -   "customerId": "cus_onoolldvec",                      -   "commerceOrder": "zc23456",                      -   "rowNumber": 3,                      -   "parameter": "commerceOrder",                      -   "errorCode": 104,                      -   "errorMsg": "commerceOrder already sent"                               }                   ]       }`

## [](#tag/customer/paths/~1customer~1getBatchCollectStatus/get)Obtiene el estado de un lote de cobros enviados por el servicio batchCollect

Este servicio permite consultar el estado de un lote de cobros enviados por medio del servicio batchCollect.

##### query Parameters

apiKey

required

string

apiKey del comercio

token

required

string

El token enviado por Flow a su página callback del servicio batchCollect.

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

Resultado del lote de cargos enviados por el servicio batchCollect

**400**

Error del Api

**401**

Error de negocio

get/customer/getBatchCollectStatus

Production server (uses live data)

https://www.flow.cl/api/customer/getBatchCollectStatus

Sandbox server (uses test data)

https://sandbox.flow.cl/api/customer/getBatchCollectStatus

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

Expand all Collapse all

`{  -   "token": "33373581FC32576FAF33C46FC6454B1FFEBD7E1H",      -   "createdDate": "2019-07-05 14:23:56",      -   "processedDate": "2019-07-05 16:03:21",      -   "status": "string",      -   "collectRows": [          -   {                  -   "commerceOrder": "zc23456",                      -   "type": "1",                      -   "flowOrder": 9876476,                      -   "url": "[https://www.flow.cl/web/pay.php](https://www.flow.cl/web/pay.php)",                      -   "token": "33373581FC32576FAF33C46FC6454B1FFEBD7E1H",                      -   "status": "string",                      -   "errorCode": 105,                      -   "errorMsg": "12300 has been previously paid"                               }                   ]       }`

## [](#tag/customer/paths/~1customer~1reverseCharge/post)Reversa un cargo efectuado en la tarjeta de crédito de un cliente

Este servicio permite reversar un cargo previamente efectuado a un cliente. Para que el cargo se reverse, este servicio debe ser invocado dentro de las 24 horas siguientes a efectuado el cargo, las 24 horas rigen desde las 14:00 hrs, es decir, si el cargo se efectuó a las 16:00 hrs, este puede reversarse hasta las 14:00 hrs del día siguiente.\\n\\n Puede enviar como parámetros el **commerceOrder** o el **flowOrder**.

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

commerceOrder

string

Identificador de la orden del comercio

flowOrder

number

Identificador de la orden de Flow

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

El objeto ReverseChargeResponse

**400**

Error del Api

**401**

Error de negocio

post/customer/reverseCharge

Production server (uses live data)

https://www.flow.cl/api/customer/reverseCharge

Sandbox server (uses test data)

https://sandbox.flow.cl/api/customer/reverseCharge

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "status": "1",      -   "message": "Reverse charge was successful"       }`

## [](#tag/customer/paths/~1customer~1getCharges/get)Lista paginada de los cargos efectuados a un cliente

Este servicio obtiene la lista paginada de los cargos efectuados a un cliente.

##### query Parameters

apiKey

required

string

apiKey del comercio

customerId

required

string

Identificador del cliente

start

integer

Número de registro de inicio de la página. Si se omite el valor por omisión es 0.

limit

integer

Número de registros por página. Si se omite el valor por omisón es 10. El valor máximo es de 100 registros por página.

filter

string

Filtro por descripción del cargo

fromDate

string <yyyy-mm-dd>

Filtro por fecha de inicio

status

integer

Filtro por estado del cargo

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

Lista paginada de los cargos efectuados a un cliente

**400**

Error del Api

**401**

Error de negocio

get/customer/getCharges

Production server (uses live data)

https://www.flow.cl/api/customer/getCharges

Sandbox server (uses test data)

https://sandbox.flow.cl/api/customer/getCharges

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "total": 200,      -   "hasMore": 1,      -   "data": "[{item list 1}{item list 2}{item list n..}"       }`

## [](#tag/customer/paths/~1customer~1getChargeAttemps/get)Lista paginada de intentos de cargos fallidos a un cliente

Este servicio obtiene la lista paginada de los intentos de cargos fallidos a un cliente.

##### query Parameters

apiKey

required

string

apiKey del comercio

customerId

required

string

Identificador del cliente

start

integer

Número de registro de inicio de la página. Si se omite el valor por omisión es 0.

limit

integer

Número de registros por página. Si se omite el valor por omisón es 10. El valor máximo es de 100 registros por página.

filter

string

Filtro por descripción del error

fromDate

string <yyyy-mm-dd>

Filtro por fecha de inicio

commerceOrder

integer

Filtro por el número de la orden del comercio

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

Lista paginada de los intentos de cargos fallidos efectuados a un cliente

**400**

Error del Api

**401**

Error de negocio

get/customer/getChargeAttemps

Production server (uses live data)

https://www.flow.cl/api/customer/getChargeAttemps

Sandbox server (uses test data)

https://sandbox.flow.cl/api/customer/getChargeAttemps

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "total": 200,      -   "hasMore": 1,      -   "data": "[{item list 1}{item list 2}{item list n..}"       }`

## [](#tag/customer/paths/~1customer~1getSubscriptions/get)Lista paginada de suscripciones de un cliente

Este servicio obtiene la lista paginada de las suscripciones de un cliente.

##### query Parameters

apiKey

required

string

apiKey del comercio

customerId

required

string

Identificador del cliente

start

integer

Número de registro de inicio de la página. Si se omite el valor por omisión es 0.

limit

integer

Número de registros por página. Si se omite el valor por omisón es 10. El valor máximo es de 100 registros por página.

filter

string

filtro por el identificador de la suscripción

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

Lista de las suscripciones de un cliente

**400**

Error del Api

**401**

Error de negocio

get/customer/getSubscriptions

Production server (uses live data)

https://www.flow.cl/api/customer/getSubscriptions

Sandbox server (uses test data)

https://sandbox.flow.cl/api/customer/getSubscriptions

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "total": 200,      -   "hasMore": 1,      -   "data": "[{item list 1}{item list 2}{item list n..}"       }`

# [](#tag/plans)plans

Permite crear planes de suscripción

## [](#tag/plans/paths/~1plans~1create/post)Crea un Plan de Suscripción

Este servicio permite crear un nuevo Plan de Suscripción

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

planId

required

string

Identificador del Plan. Un texto identificador del Plan, sin espacios, ejemplo: PlanMensual

name

required

string

Nombre del Plan

currency

string

Moneda del Plan, por omisión CLP

amount

required

number

Monto del Plan

interval

required

number

Especifica la frecuencia de cobros (generación de importe)

- 1 diario
- 2 semanal
- 3 mensual
- 4 anual

interval_count

number

Número de intervalos de frecuencia de cobros, por ejemplo:

- interval = 2 y interval_count = 2 la frecuancia será quincenal. El valor por omisión es 1.

trial_period_days

number

Número de días de Trial. El valor por omisón es 0.

days_until_due

number

Número de días pasados, después de generar un importe, para considerar el importe vencido. Si no se especifica el valor será 3.

periods_number

number

Número de períodos de duración del plan. Si el plan tiene vencimiento, entonces ingrese aquí el número de periodos de duración del plan

urlCallback

string

URL donde Flow notificará al comercio los pagos efectuados por este plan.

charges_retries_number

number

El número de reintentos de cargo, por omisión Flow utilizará 3

currency_convert_option

any

Si hay conversión de moneda, en qué momento hará la conversión:

- 1 al pago (default)
- 2 al importe (invoice)

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

El objeto Plan

**400**

Error del Api

**401**

Error de negocio

post/plans/create

Production server (uses live data)

https://www.flow.cl/api/plans/create

Sandbox server (uses test data)

https://sandbox.flow.cl/api/plans/create

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "planId": "myPlan01",      -   "name": "Plan junior",      -   "currency": "CLP",      -   "amount": 20000,      -   "interval": 3,      -   "interval_count": 1,      -   "created": "2017-07-21 12:33:15",      -   "trial_period_days": 15,      -   "days_until_due": 3,      -   "periods_number": 12,      -   "urlCallback": "[https://www.comercio.cl/flow/suscriptionResult.php](https://www.comercio.cl/flow/suscriptionResult.php)",      -   "charges_retries_number": 3,      -   "currency_convert_option": 0,      -   "status": 1,      -   "public": 1       }`

## [](#tag/plans/paths/~1plans~1get/get)Obtiene los datos de un Plan de Suscripción

Este servicio permite obtener los datos de un Plan de Suscripción

##### query Parameters

apiKey

required

string

apiKey del comercio

planId

required

string

Identificador del Plan

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

El objeto Plan

**400**

Error del Api

**401**

Error de negocio

get/plans/get

Production server (uses live data)

https://www.flow.cl/api/plans/get

Sandbox server (uses test data)

https://sandbox.flow.cl/api/plans/get

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "planId": "myPlan01",      -   "name": "Plan junior",      -   "currency": "CLP",      -   "amount": 20000,      -   "interval": 3,      -   "interval_count": 1,      -   "created": "2017-07-21 12:33:15",      -   "trial_period_days": 15,      -   "days_until_due": 3,      -   "periods_number": 12,      -   "urlCallback": "[https://www.comercio.cl/flow/suscriptionResult.php](https://www.comercio.cl/flow/suscriptionResult.php)",      -   "charges_retries_number": 3,      -   "currency_convert_option": 0,      -   "status": 1,      -   "public": 1       }`

## [](#tag/plans/paths/~1plans~1edit/post)Edita un Plan de Suscripción

Este servicio permite editar los datos de un Plan de Suscripción. Si el plan tiene clientes suscritos sólo se puede modificar el campo **trial_period_days**.

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

planId

required

string

Identificador del Plan

name

string

Nombre del Plan

currency

string

Moneda del Plan

amount

number

Monto del Plan

interval

number

Especifica la frecuencia de cobros (generación de importe)

- 1 diario
- 2 semanal
- 3 mensual
- 4 anual

interval_count

number

Número de intervalos de frecuencia de cobros, por ejemplo:

- interval = 2 y interval_count = 2 la frecuancia será quincenal. El valor por omisión es 1.

trial_period_days

number

Número de días de Trial. El valor por omisón es 0.

days_until_due

number

Número de días pasados, después de generar un importe, para considerar el importe vencido.

periods_number

number

Número de períodos de duración del plan. Si el plan tiene vencimiento, entonces ingrese aquí el número de periodos de duración del plan

urlCallback

string

URL donde Flow notificará al comercio los pagos efectuados por este plan.

charges_retries_number

number

El número de reintentos de cargo, por omisión Flow utilizará 3

currency_convert_option

any

Si hay conversión de moneda, en qué momento hará la conversión:

- 1 al pago (default)
- 2 al importe (invoice)

s

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

El objeto Plan

**400**

Error del Api

**401**

Error de negocio

post/plans/edit

Production server (uses live data)

https://www.flow.cl/api/plans/edit

Sandbox server (uses test data)

https://sandbox.flow.cl/api/plans/edit

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "planId": "myPlan01",      -   "name": "Plan junior",      -   "currency": "CLP",      -   "amount": 20000,      -   "interval": 3,      -   "interval_count": 1,      -   "created": "2017-07-21 12:33:15",      -   "trial_period_days": 15,      -   "days_until_due": 3,      -   "periods_number": 12,      -   "urlCallback": "[https://www.comercio.cl/flow/suscriptionResult.php](https://www.comercio.cl/flow/suscriptionResult.php)",      -   "charges_retries_number": 3,      -   "currency_convert_option": 0,      -   "status": 1,      -   "public": 1       }`

## [](#tag/plans/paths/~1plans~1delete/post)Elimina un Plan de Suscripción

Este servicio permite eliminar un Plan de Suscripción. El eliminar un Plan significa que ya no podrá suscribir nuevos clientes al plan. Pero las suscripciones activas continuarán su ciclo de vida mientras estas no sean cancelas.

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

planId

required

string

Identificador del Plan

s

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

El objeto Plan

**400**

Error del Api

**401**

Error de negocio

post/plans/delete

Production server (uses live data)

https://www.flow.cl/api/plans/delete

Sandbox server (uses test data)

https://sandbox.flow.cl/api/plans/delete

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "planId": "myPlan01",      -   "name": "Plan junior",      -   "currency": "CLP",      -   "amount": 20000,      -   "interval": 3,      -   "interval_count": 1,      -   "created": "2017-07-21 12:33:15",      -   "trial_period_days": 15,      -   "days_until_due": 3,      -   "periods_number": 12,      -   "urlCallback": "[https://www.comercio.cl/flow/suscriptionResult.php](https://www.comercio.cl/flow/suscriptionResult.php)",      -   "charges_retries_number": 3,      -   "currency_convert_option": 0,      -   "status": 1,      -   "public": 1       }`

## [](#tag/plans/paths/~1plans~1list/get)Lista paginada de planes de suscripción

Permite obtener la lista de planes de suscripción paginada de acuerdo a los parámetros de paginación. Además, se puede definir los siguientes filtros:

- filter: filtro por nombre del plan
- status: filtro por estado del plan

##### query Parameters

apiKey

required

string

apiKey del comercio

start

integer

Número de registro de inicio de la página. Si se omite el valor por omisión es 0.

limit

integer

Número de registros por página. Si se omite el valor por omisón es 10. El valor máximo es de 100 registros por página

filter

string

Filtro por el nombre del Plan

status

integer

Filtro por el estado del Plan 1-Activo 0-Eliminado

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

Lista paginada de Planes

**400**

Error del Api

**401**

Error de negocio

get/plans/list

Production server (uses live data)

https://www.flow.cl/api/plans/list

Sandbox server (uses test data)

https://sandbox.flow.cl/api/plans/list

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "total": 200,      -   "hasMore": 1,      -   "data": "[{item list 1}{item list 2}{item list n..}"       }`

# [](#tag/subscription)subscription

Permite suscribir clientes a un plan de suscripción.

## [](#tag/subscription/paths/~1subscription~1create/post)Crea una nueva suscripción a un Plan

Este servicio permite crear una nueva suscripción de un cliente a un Plan. Para crear una nueva suscripción, basta con enviar los parámetros **planId** y **customerId**, los parámetros opcionales son:

Parámetro

Descripción

subscription_start

Fecha de inicio de la suscripción

couponId

Identificador de cupón de descuento

trial_period_days

Número de días de Trial

planAdditionalList

Adicionales de la suscripción

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

planId

required

string

Identificador del Plan

customerId

required

string

Identificador del cliente

subscription_start

string <yyyy-mm-dd>

La fecha de inicio de la suscripción

couponId

number

Si quiere aplicarle un descuento, el identificador del cupón de descuento.

trial_period_days

number

Número de días de Trial. Si el parámetro viene presente, se utilizará lo enviado como la cantidad de días de Trial. En caso de no venir presente se utilizará el trial_periods_number configurado en el Plan asociado.

periods_number

number

Número de períodos de duración de la subscripción. Si null, entonces tomará el periods_number del plan.

planAdditionalList

Array of numbers

Adicionales de la suscripción

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

El objeto Subscription

**400**

Error del Api

**401**

Error de negocio

post/subscription/create

Production server (uses live data)

https://www.flow.cl/api/subscription/create

Sandbox server (uses test data)

https://sandbox.flow.cl/api/subscription/create

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

Expand all Collapse all

`{  -   "subscriptionId": "sus_azcyjj9ycd",      -   "planId": "MiPlanMensual",      -   "plan_name": "Plan mensual",      -   "customerId": "cus_eblcbsua2g",      -   "created": "2018-06-26 17:29:06",      -   "subscription_start": "2018-06-26 17:29:06",      -   "subscription_end": "2019-06-25 00:00:00",      -   "period_start": "2018-06-26 00:00:00",      -   "period_end": "2018-06-26 00:00:00",      -   "next_invoice_date": "2018-06-27 00:00:00",      -   "trial_period_days": 1,      -   "trial_start": "2018-06-26 00:00:00",      -   "trial_end": "2018-06-26 00:00:00",      -   "cancel_at_period_end": 0,      -   "cancel_at": null,      -   "periods_number": 12,      -   "days_until_due": 3,      -   "status": 1,      -   "discount_balance": "20000.0000",      -   "newPlanId": 12,      -   "new_plan_scheduled_change_date": null,      -   "in_new_plan_next_attempt_date": null,      -   "morose": 0,      -   "discount": {          -   "id": 181,              -   "type": "Subscription discount",              -   "created": "2019-12-01 00:00:00",              -   "start": "2019-12-01 00:00:00",              -   "end": "2019-12-31 00:00:00",              -   "deleted": "2019-12-25 00:00:00",              -   "status": 1,              -   "coupon": {                  -   "id": 166,                      -   "name": 166,                      -   "percent_off": 10,                      -   "currency": "CLP",                      -   "amount": 2000,                      -   "created": "2018-07-13 09:57:53",                      -   "duration": 1,                      -   "times": 1,                      -   "max_redemptions": 50,                      -   "expires": "2018-12-31 00:00:00",                      -   "status": 1,                      -   "redemtions": 21                               }                   },      -   "invoices": [          -   {                  -   "id": 1034,                      -   "subscriptionId": "sus_azcyjj9ycd",                      -   "customerId": "cus_eblcbsua2g",                      -   "created": "2018-06-26 17:29:06",                      -   "subject": "PlanPesos - período 2018-06-27 / 2018-06-27",                      -   "currency": "CLP",                      -   "amount": 20000,                      -   "period_start": "2018-06-27 00:00:00",                      -   "period_end": "2018-07-26 00:00:00",                      -   "attemp_count": 0,                      -   "attemped": 1,                      -   "next_attemp_date": "2018-07-27 00:00:00",                      -   "due_date": "2018-06-30 00:00:00",                      -   "status": 0,                      -   "error": 0,                      -   "errorDate": "2018-06-30 00:00:00",                      -   "errorDescription": "The minimum amount is 350 CLP",                      -   "items": [                          -   {                                  -   "id": 567,                                      -   "subject": "PlanPesos - período 2018-06-27 / 2018-06-27",                                      -   "type": 1,                                      -   "currency": "CLP",                                      -   "amount": 20000                                                       }                                           ],                      -   "payment": {                          -   "flowOrder": 3567899,                              -   "commerceOrder": "sf12377",                              -   "requestDate": "2017-07-21 12:32:11",                              -   "status": 1,                              -   "subject": "game console",                              -   "currency": "CLP",                              -   "amount": 12000,                              -   "payer": "pperez@gamil.com",                              -   "optional": {                                  -   "RUT": "7025521-9",                                      -   "ID": "899564778"                                                       },                              -   "pending_info": {                                  -   "media": "Multicaja",                                      -   "date": "2017-07-21 10:30:12"                                                       },                              -   "paymentData": {                                  -   "date": "2017-07-21 12:32:11",                                      -   "media": "webpay",                                      -   "conversionDate": "2017-07-21",                                      -   "conversionRate": 1.1,                                      -   "amount": 12000,                                      -   "currency": "CLP",                                      -   "fee": 551,                                      -   "balance": 11499,                                      -   "transferDate": "2017-07-24"                                                       },                              -   "merchantId": "string"                                           },                      -   "outsidePayment": {                          -   "date": "2021-03-08 00:00:00",                              -   "comment": "Pago por caja"                                           },                      -   "paymentLink": "[https://www.flow.cl/app/web/pay.php?token=7C18C35358FEF0E33C056C719E94956D4FC9BBEL](https://www.flow.cl/app/web/pay.php?token=7C18C35358FEF0E33C056C719E94956D4FC9BBEL)",                      -   "chargeAttemps": [                          -   {                                  -   "id": 901,                                      -   "date": "2018-12-06 15:03:33",                                      -   "customerId": "cus_1uqfm95dch",                                      -   "invoiceId": 1234,                                      -   "commerceOrder": "1883",                                      -   "currency": "CLP",                                      -   "amount": 90000,                                      -   "errorCode": 1605,                                      -   "errorDescription": "This commerceOrder 1883 has been previously paid"                                                       }                                           ]                               }                   ],      -   "planAdditionalList": [          -   {                  -   "s_item_id": 3,                      -   "item_id": 1,                      -   "sub_id": 421527,                      -   "name": "Test",                      -   "currency": "CLP",                      -   "amount": 500,                      -   "created_at": "2019-09-26 14:12:41",                      -   "updated_at": "2019-09-26 14:12:41",                      -   "completeAmountFormat": "$ 500 CLP",                      -   "amountFormat": "500",                      -   "adjustmentTypeLabel": "Aumenta"                               },              -   {                  -   "s_item_id": 4,                      -   "item_id": 2,                      -   "sub_id": 421527,                      -   "name": "Test 2",                      -   "currency": "CLP",                      -   "amount": 500,                      -   "created_at": "2019-09-26 14:15:41",                      -   "updated_at": "2019-09-26 14:15:41",                      -   "completeAmountFormat": "$ 500 CLP",                      -   "amountFormat": "500",                      -   "adjustmentTypeLabel": "Aumenta"                               },              -   {                  -   "s_item_id": 5,                      -   "item_id": 3,                      -   "sub_id": 421527,                      -   "name": "Test 14",                      -   "currency": "CLP",                      -   "amount": 500,                      -   "created_at": "2019-09-26 14:16:41",                      -   "updated_at": "2019-09-26 14:16:41",                      -   "completeAmountFormat": "$ 500 CLP",                      -   "amountFormat": "500",                      -   "adjustmentTypeLabel": "Aumenta"                               }                   ]       }`

## [](#tag/subscription/paths/~1subscription~1get/get)Obtiene una Suscripción en base al subscriptionId

Este servicio permite obtener los datos de una suscripción.

##### query Parameters

apiKey

required

string

apiKeyel comercio

subscriptionId

required

string

Identificador de la suscripción

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

El objeto Subscription

**400**

Error del Api

**401**

Error de negocio

get/subscription/get

Production server (uses live data)

https://www.flow.cl/api/subscription/get

Sandbox server (uses test data)

https://sandbox.flow.cl/api/subscription/get

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

Expand all Collapse all

`{  -   "subscriptionId": "sus_azcyjj9ycd",      -   "planId": "MiPlanMensual",      -   "plan_name": "Plan mensual",      -   "customerId": "cus_eblcbsua2g",      -   "created": "2018-06-26 17:29:06",      -   "subscription_start": "2018-06-26 17:29:06",      -   "subscription_end": "2019-06-25 00:00:00",      -   "period_start": "2018-06-26 00:00:00",      -   "period_end": "2018-06-26 00:00:00",      -   "next_invoice_date": "2018-06-27 00:00:00",      -   "trial_period_days": 1,      -   "trial_start": "2018-06-26 00:00:00",      -   "trial_end": "2018-06-26 00:00:00",      -   "cancel_at_period_end": 0,      -   "cancel_at": null,      -   "periods_number": 12,      -   "days_until_due": 3,      -   "status": 1,      -   "discount_balance": "20000.0000",      -   "newPlanId": 12,      -   "new_plan_scheduled_change_date": null,      -   "in_new_plan_next_attempt_date": null,      -   "morose": 0,      -   "discount": {          -   "id": 181,              -   "type": "Subscription discount",              -   "created": "2019-12-01 00:00:00",              -   "start": "2019-12-01 00:00:00",              -   "end": "2019-12-31 00:00:00",              -   "deleted": "2019-12-25 00:00:00",              -   "status": 1,              -   "coupon": {                  -   "id": 166,                      -   "name": 166,                      -   "percent_off": 10,                      -   "currency": "CLP",                      -   "amount": 2000,                      -   "created": "2018-07-13 09:57:53",                      -   "duration": 1,                      -   "times": 1,                      -   "max_redemptions": 50,                      -   "expires": "2018-12-31 00:00:00",                      -   "status": 1,                      -   "redemtions": 21                               }                   },      -   "invoices": [          -   {                  -   "id": 1034,                      -   "subscriptionId": "sus_azcyjj9ycd",                      -   "customerId": "cus_eblcbsua2g",                      -   "created": "2018-06-26 17:29:06",                      -   "subject": "PlanPesos - período 2018-06-27 / 2018-06-27",                      -   "currency": "CLP",                      -   "amount": 20000,                      -   "period_start": "2018-06-27 00:00:00",                      -   "period_end": "2018-07-26 00:00:00",                      -   "attemp_count": 0,                      -   "attemped": 1,                      -   "next_attemp_date": "2018-07-27 00:00:00",                      -   "due_date": "2018-06-30 00:00:00",                      -   "status": 0,                      -   "error": 0,                      -   "errorDate": "2018-06-30 00:00:00",                      -   "errorDescription": "The minimum amount is 350 CLP",                      -   "items": [                          -   {                                  -   "id": 567,                                      -   "subject": "PlanPesos - período 2018-06-27 / 2018-06-27",                                      -   "type": 1,                                      -   "currency": "CLP",                                      -   "amount": 20000                                                       }                                           ],                      -   "payment": {                          -   "flowOrder": 3567899,                              -   "commerceOrder": "sf12377",                              -   "requestDate": "2017-07-21 12:32:11",                              -   "status": 1,                              -   "subject": "game console",                              -   "currency": "CLP",                              -   "amount": 12000,                              -   "payer": "pperez@gamil.com",                              -   "optional": {                                  -   "RUT": "7025521-9",                                      -   "ID": "899564778"                                                       },                              -   "pending_info": {                                  -   "media": "Multicaja",                                      -   "date": "2017-07-21 10:30:12"                                                       },                              -   "paymentData": {                                  -   "date": "2017-07-21 12:32:11",                                      -   "media": "webpay",                                      -   "conversionDate": "2017-07-21",                                      -   "conversionRate": 1.1,                                      -   "amount": 12000,                                      -   "currency": "CLP",                                      -   "fee": 551,                                      -   "balance": 11499,                                      -   "transferDate": "2017-07-24"                                                       },                              -   "merchantId": "string"                                           },                      -   "outsidePayment": {                          -   "date": "2021-03-08 00:00:00",                              -   "comment": "Pago por caja"                                           },                      -   "paymentLink": "[https://www.flow.cl/app/web/pay.php?token=7C18C35358FEF0E33C056C719E94956D4FC9BBEL](https://www.flow.cl/app/web/pay.php?token=7C18C35358FEF0E33C056C719E94956D4FC9BBEL)",                      -   "chargeAttemps": [                          -   {                                  -   "id": 901,                                      -   "date": "2018-12-06 15:03:33",                                      -   "customerId": "cus_1uqfm95dch",                                      -   "invoiceId": 1234,                                      -   "commerceOrder": "1883",                                      -   "currency": "CLP",                                      -   "amount": 90000,                                      -   "errorCode": 1605,                                      -   "errorDescription": "This commerceOrder 1883 has been previously paid"                                                       }                                           ]                               }                   ],      -   "planAdditionalList": [          -   {                  -   "s_item_id": 3,                      -   "item_id": 1,                      -   "sub_id": 421527,                      -   "name": "Test",                      -   "currency": "CLP",                      -   "amount": 500,                      -   "created_at": "2019-09-26 14:12:41",                      -   "updated_at": "2019-09-26 14:12:41",                      -   "completeAmountFormat": "$ 500 CLP",                      -   "amountFormat": "500",                      -   "adjustmentTypeLabel": "Aumenta"                               },              -   {                  -   "s_item_id": 4,                      -   "item_id": 2,                      -   "sub_id": 421527,                      -   "name": "Test 2",                      -   "currency": "CLP",                      -   "amount": 500,                      -   "created_at": "2019-09-26 14:15:41",                      -   "updated_at": "2019-09-26 14:15:41",                      -   "completeAmountFormat": "$ 500 CLP",                      -   "amountFormat": "500",                      -   "adjustmentTypeLabel": "Aumenta"                               },              -   {                  -   "s_item_id": 5,                      -   "item_id": 3,                      -   "sub_id": 421527,                      -   "name": "Test 14",                      -   "currency": "CLP",                      -   "amount": 500,                      -   "created_at": "2019-09-26 14:16:41",                      -   "updated_at": "2019-09-26 14:16:41",                      -   "completeAmountFormat": "$ 500 CLP",                      -   "amountFormat": "500",                      -   "adjustmentTypeLabel": "Aumenta"                               }                   ]       }`

## [](#tag/subscription/paths/~1subscription~1list/get)Obtiene la lista de suscripciones para un Plan

Permite obtener la lista de suscripciones paginada de acuerdo a los parámetros de paginación. Además, se puede definir los siguientes filtros:

- filter: filtro por nombre del plan
- status: filtro por estado de la suscripción.

##### query Parameters

apiKey

required

string

apiKeyel comercio

planId

required

string

Identificador del Plan

start

integer

número de registro de inicio de la página. Si se omite el valor por omisión es 0.

limit

integer

Número de registros por página. Si se omite el valor por omisón es 10. El valor máximo es de 100 registros por página.

filter

string

filtro por el nombre del cliente

status

integer

Filtro por el estado de la suscripción

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

Lista paginada de suscripciones de un Plan

**400**

Error del Api

**401**

Error de negocio

get/subscription/list

Production server (uses live data)

https://www.flow.cl/api/subscription/list

Sandbox server (uses test data)

https://sandbox.flow.cl/api/subscription/list

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "total": 200,      -   "hasMore": 1,      -   "data": "[{item list 1}{item list 2}{item list n..}"       }`

## [](#tag/subscription/paths/~1subscription~1changeTrial/post)Modifica los días de Trial de una suscripción

Este servicio permite modificar los días de Trial de una suscripción. Sólo se puede modificar los días de Trial a una suscripción que aún no se ha iniciado o que todavía está vigente el Trial.

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKeyel comercio

subscriptionId

required

string

Identificador de la suscripción

trial_period_days

required

number

Número de días de Trial

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

El objeto Subscription

**400**

Error del Api

**401**

Error de negocio

post/subscription/changeTrial

Production server (uses live data)

https://www.flow.cl/api/subscription/changeTrial

Sandbox server (uses test data)

https://sandbox.flow.cl/api/subscription/changeTrial

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

Expand all Collapse all

`{  -   "subscriptionId": "sus_azcyjj9ycd",      -   "planId": "MiPlanMensual",      -   "plan_name": "Plan mensual",      -   "customerId": "cus_eblcbsua2g",      -   "created": "2018-06-26 17:29:06",      -   "subscription_start": "2018-06-26 17:29:06",      -   "subscription_end": "2019-06-25 00:00:00",      -   "period_start": "2018-06-26 00:00:00",      -   "period_end": "2018-06-26 00:00:00",      -   "next_invoice_date": "2018-06-27 00:00:00",      -   "trial_period_days": 1,      -   "trial_start": "2018-06-26 00:00:00",      -   "trial_end": "2018-06-26 00:00:00",      -   "cancel_at_period_end": 0,      -   "cancel_at": null,      -   "periods_number": 12,      -   "days_until_due": 3,      -   "status": 1,      -   "discount_balance": "20000.0000",      -   "newPlanId": 12,      -   "new_plan_scheduled_change_date": null,      -   "in_new_plan_next_attempt_date": null,      -   "morose": 0,      -   "discount": {          -   "id": 181,              -   "type": "Subscription discount",              -   "created": "2019-12-01 00:00:00",              -   "start": "2019-12-01 00:00:00",              -   "end": "2019-12-31 00:00:00",              -   "deleted": "2019-12-25 00:00:00",              -   "status": 1,              -   "coupon": {                  -   "id": 166,                      -   "name": 166,                      -   "percent_off": 10,                      -   "currency": "CLP",                      -   "amount": 2000,                      -   "created": "2018-07-13 09:57:53",                      -   "duration": 1,                      -   "times": 1,                      -   "max_redemptions": 50,                      -   "expires": "2018-12-31 00:00:00",                      -   "status": 1,                      -   "redemtions": 21                               }                   },      -   "invoices": [          -   {                  -   "id": 1034,                      -   "subscriptionId": "sus_azcyjj9ycd",                      -   "customerId": "cus_eblcbsua2g",                      -   "created": "2018-06-26 17:29:06",                      -   "subject": "PlanPesos - período 2018-06-27 / 2018-06-27",                      -   "currency": "CLP",                      -   "amount": 20000,                      -   "period_start": "2018-06-27 00:00:00",                      -   "period_end": "2018-07-26 00:00:00",                      -   "attemp_count": 0,                      -   "attemped": 1,                      -   "next_attemp_date": "2018-07-27 00:00:00",                      -   "due_date": "2018-06-30 00:00:00",                      -   "status": 0,                      -   "error": 0,                      -   "errorDate": "2018-06-30 00:00:00",                      -   "errorDescription": "The minimum amount is 350 CLP",                      -   "items": [                          -   {                                  -   "id": 567,                                      -   "subject": "PlanPesos - período 2018-06-27 / 2018-06-27",                                      -   "type": 1,                                      -   "currency": "CLP",                                      -   "amount": 20000                                                       }                                           ],                      -   "payment": {                          -   "flowOrder": 3567899,                              -   "commerceOrder": "sf12377",                              -   "requestDate": "2017-07-21 12:32:11",                              -   "status": 1,                              -   "subject": "game console",                              -   "currency": "CLP",                              -   "amount": 12000,                              -   "payer": "pperez@gamil.com",                              -   "optional": {                                  -   "RUT": "7025521-9",                                      -   "ID": "899564778"                                                       },                              -   "pending_info": {                                  -   "media": "Multicaja",                                      -   "date": "2017-07-21 10:30:12"                                                       },                              -   "paymentData": {                                  -   "date": "2017-07-21 12:32:11",                                      -   "media": "webpay",                                      -   "conversionDate": "2017-07-21",                                      -   "conversionRate": 1.1,                                      -   "amount": 12000,                                      -   "currency": "CLP",                                      -   "fee": 551,                                      -   "balance": 11499,                                      -   "transferDate": "2017-07-24"                                                       },                              -   "merchantId": "string"                                           },                      -   "outsidePayment": {                          -   "date": "2021-03-08 00:00:00",                              -   "comment": "Pago por caja"                                           },                      -   "paymentLink": "[https://www.flow.cl/app/web/pay.php?token=7C18C35358FEF0E33C056C719E94956D4FC9BBEL](https://www.flow.cl/app/web/pay.php?token=7C18C35358FEF0E33C056C719E94956D4FC9BBEL)",                      -   "chargeAttemps": [                          -   {                                  -   "id": 901,                                      -   "date": "2018-12-06 15:03:33",                                      -   "customerId": "cus_1uqfm95dch",                                      -   "invoiceId": 1234,                                      -   "commerceOrder": "1883",                                      -   "currency": "CLP",                                      -   "amount": 90000,                                      -   "errorCode": 1605,                                      -   "errorDescription": "This commerceOrder 1883 has been previously paid"                                                       }                                           ]                               }                   ],      -   "planAdditionalList": [          -   {                  -   "s_item_id": 3,                      -   "item_id": 1,                      -   "sub_id": 421527,                      -   "name": "Test",                      -   "currency": "CLP",                      -   "amount": 500,                      -   "created_at": "2019-09-26 14:12:41",                      -   "updated_at": "2019-09-26 14:12:41",                      -   "completeAmountFormat": "$ 500 CLP",                      -   "amountFormat": "500",                      -   "adjustmentTypeLabel": "Aumenta"                               },              -   {                  -   "s_item_id": 4,                      -   "item_id": 2,                      -   "sub_id": 421527,                      -   "name": "Test 2",                      -   "currency": "CLP",                      -   "amount": 500,                      -   "created_at": "2019-09-26 14:15:41",                      -   "updated_at": "2019-09-26 14:15:41",                      -   "completeAmountFormat": "$ 500 CLP",                      -   "amountFormat": "500",                      -   "adjustmentTypeLabel": "Aumenta"                               },              -   {                  -   "s_item_id": 5,                      -   "item_id": 3,                      -   "sub_id": 421527,                      -   "name": "Test 14",                      -   "currency": "CLP",                      -   "amount": 500,                      -   "created_at": "2019-09-26 14:16:41",                      -   "updated_at": "2019-09-26 14:16:41",                      -   "completeAmountFormat": "$ 500 CLP",                      -   "amountFormat": "500",                      -   "adjustmentTypeLabel": "Aumenta"                               }                   ]       }`

## [](#tag/subscription/paths/~1subscription~1cancel/post)Cancela una suscripción

Este servicio permite cancelar una suscripción. Existen formas de cancelar una suscripción:

- inmediatamente. Es decir, en este instante
- al terminar el perído vigente.

Si desea cancelar la suscripción inmediatamente, envíe el parámetro **at_period_end** con valor 0, si desea cancelarla al final del período vigente envíe el valor 1.

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

subscriptionId

required

string

Identificador de la suscripción.

at_period_end

number

1 Si la cancelación será al finalizar el período vigente 0 Si la cancelación será inmediata.

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

El objeto Subscription

**400**

Error del Api

**401**

Error de negocio

post/subscription/cancel

Production server (uses live data)

https://www.flow.cl/api/subscription/cancel

Sandbox server (uses test data)

https://sandbox.flow.cl/api/subscription/cancel

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

Expand all Collapse all

`{  -   "subscriptionId": "sus_azcyjj9ycd",      -   "planId": "MiPlanMensual",      -   "plan_name": "Plan mensual",      -   "customerId": "cus_eblcbsua2g",      -   "created": "2018-06-26 17:29:06",      -   "subscription_start": "2018-06-26 17:29:06",      -   "subscription_end": "2019-06-25 00:00:00",      -   "period_start": "2018-06-26 00:00:00",      -   "period_end": "2018-06-26 00:00:00",      -   "next_invoice_date": "2018-06-27 00:00:00",      -   "trial_period_days": 1,      -   "trial_start": "2018-06-26 00:00:00",      -   "trial_end": "2018-06-26 00:00:00",      -   "cancel_at_period_end": 0,      -   "cancel_at": null,      -   "periods_number": 12,      -   "days_until_due": 3,      -   "status": 1,      -   "discount_balance": "20000.0000",      -   "newPlanId": 12,      -   "new_plan_scheduled_change_date": null,      -   "in_new_plan_next_attempt_date": null,      -   "morose": 0,      -   "discount": {          -   "id": 181,              -   "type": "Subscription discount",              -   "created": "2019-12-01 00:00:00",              -   "start": "2019-12-01 00:00:00",              -   "end": "2019-12-31 00:00:00",              -   "deleted": "2019-12-25 00:00:00",              -   "status": 1,              -   "coupon": {                  -   "id": 166,                      -   "name": 166,                      -   "percent_off": 10,                      -   "currency": "CLP",                      -   "amount": 2000,                      -   "created": "2018-07-13 09:57:53",                      -   "duration": 1,                      -   "times": 1,                      -   "max_redemptions": 50,                      -   "expires": "2018-12-31 00:00:00",                      -   "status": 1,                      -   "redemtions": 21                               }                   },      -   "invoices": [          -   {                  -   "id": 1034,                      -   "subscriptionId": "sus_azcyjj9ycd",                      -   "customerId": "cus_eblcbsua2g",                      -   "created": "2018-06-26 17:29:06",                      -   "subject": "PlanPesos - período 2018-06-27 / 2018-06-27",                      -   "currency": "CLP",                      -   "amount": 20000,                      -   "period_start": "2018-06-27 00:00:00",                      -   "period_end": "2018-07-26 00:00:00",                      -   "attemp_count": 0,                      -   "attemped": 1,                      -   "next_attemp_date": "2018-07-27 00:00:00",                      -   "due_date": "2018-06-30 00:00:00",                      -   "status": 0,                      -   "error": 0,                      -   "errorDate": "2018-06-30 00:00:00",                      -   "errorDescription": "The minimum amount is 350 CLP",                      -   "items": [                          -   {                                  -   "id": 567,                                      -   "subject": "PlanPesos - período 2018-06-27 / 2018-06-27",                                      -   "type": 1,                                      -   "currency": "CLP",                                      -   "amount": 20000                                                       }                                           ],                      -   "payment": {                          -   "flowOrder": 3567899,                              -   "commerceOrder": "sf12377",                              -   "requestDate": "2017-07-21 12:32:11",                              -   "status": 1,                              -   "subject": "game console",                              -   "currency": "CLP",                              -   "amount": 12000,                              -   "payer": "pperez@gamil.com",                              -   "optional": {                                  -   "RUT": "7025521-9",                                      -   "ID": "899564778"                                                       },                              -   "pending_info": {                                  -   "media": "Multicaja",                                      -   "date": "2017-07-21 10:30:12"                                                       },                              -   "paymentData": {                                  -   "date": "2017-07-21 12:32:11",                                      -   "media": "webpay",                                      -   "conversionDate": "2017-07-21",                                      -   "conversionRate": 1.1,                                      -   "amount": 12000,                                      -   "currency": "CLP",                                      -   "fee": 551,                                      -   "balance": 11499,                                      -   "transferDate": "2017-07-24"                                                       },                              -   "merchantId": "string"                                           },                      -   "outsidePayment": {                          -   "date": "2021-03-08 00:00:00",                              -   "comment": "Pago por caja"                                           },                      -   "paymentLink": "[https://www.flow.cl/app/web/pay.php?token=7C18C35358FEF0E33C056C719E94956D4FC9BBEL](https://www.flow.cl/app/web/pay.php?token=7C18C35358FEF0E33C056C719E94956D4FC9BBEL)",                      -   "chargeAttemps": [                          -   {                                  -   "id": 901,                                      -   "date": "2018-12-06 15:03:33",                                      -   "customerId": "cus_1uqfm95dch",                                      -   "invoiceId": 1234,                                      -   "commerceOrder": "1883",                                      -   "currency": "CLP",                                      -   "amount": 90000,                                      -   "errorCode": 1605,                                      -   "errorDescription": "This commerceOrder 1883 has been previously paid"                                                       }                                           ]                               }                   ],      -   "planAdditionalList": [          -   {                  -   "s_item_id": 3,                      -   "item_id": 1,                      -   "sub_id": 421527,                      -   "name": "Test",                      -   "currency": "CLP",                      -   "amount": 500,                      -   "created_at": "2019-09-26 14:12:41",                      -   "updated_at": "2019-09-26 14:12:41",                      -   "completeAmountFormat": "$ 500 CLP",                      -   "amountFormat": "500",                      -   "adjustmentTypeLabel": "Aumenta"                               },              -   {                  -   "s_item_id": 4,                      -   "item_id": 2,                      -   "sub_id": 421527,                      -   "name": "Test 2",                      -   "currency": "CLP",                      -   "amount": 500,                      -   "created_at": "2019-09-26 14:15:41",                      -   "updated_at": "2019-09-26 14:15:41",                      -   "completeAmountFormat": "$ 500 CLP",                      -   "amountFormat": "500",                      -   "adjustmentTypeLabel": "Aumenta"                               },              -   {                  -   "s_item_id": 5,                      -   "item_id": 3,                      -   "sub_id": 421527,                      -   "name": "Test 14",                      -   "currency": "CLP",                      -   "amount": 500,                      -   "created_at": "2019-09-26 14:16:41",                      -   "updated_at": "2019-09-26 14:16:41",                      -   "completeAmountFormat": "$ 500 CLP",                      -   "amountFormat": "500",                      -   "adjustmentTypeLabel": "Aumenta"                               }                   ]       }`

## [](#tag/subscription/paths/~1subscription~1addCoupon/post)Agrega un descuento a la suscripción

Este servicio permite agregar un descuento a la suscripción. Si la suscripción ya tenía un descuento, será reemplazado por este.

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

subscriptionId

required

string

Identificador de la suscripción

couponId

required

number

Identificador del cupón de descuento.

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

El objeto Subscription

**400**

Error del Api

**401**

Error de negocio

post/subscription/addCoupon

Production server (uses live data)

https://www.flow.cl/api/subscription/addCoupon

Sandbox server (uses test data)

https://sandbox.flow.cl/api/subscription/addCoupon

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

Expand all Collapse all

`{  -   "subscriptionId": "sus_azcyjj9ycd",      -   "planId": "MiPlanMensual",      -   "plan_name": "Plan mensual",      -   "customerId": "cus_eblcbsua2g",      -   "created": "2018-06-26 17:29:06",      -   "subscription_start": "2018-06-26 17:29:06",      -   "subscription_end": "2019-06-25 00:00:00",      -   "period_start": "2018-06-26 00:00:00",      -   "period_end": "2018-06-26 00:00:00",      -   "next_invoice_date": "2018-06-27 00:00:00",      -   "trial_period_days": 1,      -   "trial_start": "2018-06-26 00:00:00",      -   "trial_end": "2018-06-26 00:00:00",      -   "cancel_at_period_end": 0,      -   "cancel_at": null,      -   "periods_number": 12,      -   "days_until_due": 3,      -   "status": 1,      -   "discount_balance": "20000.0000",      -   "newPlanId": 12,      -   "new_plan_scheduled_change_date": null,      -   "in_new_plan_next_attempt_date": null,      -   "morose": 0,      -   "discount": {          -   "id": 181,              -   "type": "Subscription discount",              -   "created": "2019-12-01 00:00:00",              -   "start": "2019-12-01 00:00:00",              -   "end": "2019-12-31 00:00:00",              -   "deleted": "2019-12-25 00:00:00",              -   "status": 1,              -   "coupon": {                  -   "id": 166,                      -   "name": 166,                      -   "percent_off": 10,                      -   "currency": "CLP",                      -   "amount": 2000,                      -   "created": "2018-07-13 09:57:53",                      -   "duration": 1,                      -   "times": 1,                      -   "max_redemptions": 50,                      -   "expires": "2018-12-31 00:00:00",                      -   "status": 1,                      -   "redemtions": 21                               }                   },      -   "invoices": [          -   {                  -   "id": 1034,                      -   "subscriptionId": "sus_azcyjj9ycd",                      -   "customerId": "cus_eblcbsua2g",                      -   "created": "2018-06-26 17:29:06",                      -   "subject": "PlanPesos - período 2018-06-27 / 2018-06-27",                      -   "currency": "CLP",                      -   "amount": 20000,                      -   "period_start": "2018-06-27 00:00:00",                      -   "period_end": "2018-07-26 00:00:00",                      -   "attemp_count": 0,                      -   "attemped": 1,                      -   "next_attemp_date": "2018-07-27 00:00:00",                      -   "due_date": "2018-06-30 00:00:00",                      -   "status": 0,                      -   "error": 0,                      -   "errorDate": "2018-06-30 00:00:00",                      -   "errorDescription": "The minimum amount is 350 CLP",                      -   "items": [                          -   {                                  -   "id": 567,                                      -   "subject": "PlanPesos - período 2018-06-27 / 2018-06-27",                                      -   "type": 1,                                      -   "currency": "CLP",                                      -   "amount": 20000                                                       }                                           ],                      -   "payment": {                          -   "flowOrder": 3567899,                              -   "commerceOrder": "sf12377",                              -   "requestDate": "2017-07-21 12:32:11",                              -   "status": 1,                              -   "subject": "game console",                              -   "currency": "CLP",                              -   "amount": 12000,                              -   "payer": "pperez@gamil.com",                              -   "optional": {                                  -   "RUT": "7025521-9",                                      -   "ID": "899564778"                                                       },                              -   "pending_info": {                                  -   "media": "Multicaja",                                      -   "date": "2017-07-21 10:30:12"                                                       },                              -   "paymentData": {                                  -   "date": "2017-07-21 12:32:11",                                      -   "media": "webpay",                                      -   "conversionDate": "2017-07-21",                                      -   "conversionRate": 1.1,                                      -   "amount": 12000,                                      -   "currency": "CLP",                                      -   "fee": 551,                                      -   "balance": 11499,                                      -   "transferDate": "2017-07-24"                                                       },                              -   "merchantId": "string"                                           },                      -   "outsidePayment": {                          -   "date": "2021-03-08 00:00:00",                              -   "comment": "Pago por caja"                                           },                      -   "paymentLink": "[https://www.flow.cl/app/web/pay.php?token=7C18C35358FEF0E33C056C719E94956D4FC9BBEL](https://www.flow.cl/app/web/pay.php?token=7C18C35358FEF0E33C056C719E94956D4FC9BBEL)",                      -   "chargeAttemps": [                          -   {                                  -   "id": 901,                                      -   "date": "2018-12-06 15:03:33",                                      -   "customerId": "cus_1uqfm95dch",                                      -   "invoiceId": 1234,                                      -   "commerceOrder": "1883",                                      -   "currency": "CLP",                                      -   "amount": 90000,                                      -   "errorCode": 1605,                                      -   "errorDescription": "This commerceOrder 1883 has been previously paid"                                                       }                                           ]                               }                   ],      -   "planAdditionalList": [          -   {                  -   "s_item_id": 3,                      -   "item_id": 1,                      -   "sub_id": 421527,                      -   "name": "Test",                      -   "currency": "CLP",                      -   "amount": 500,                      -   "created_at": "2019-09-26 14:12:41",                      -   "updated_at": "2019-09-26 14:12:41",                      -   "completeAmountFormat": "$ 500 CLP",                      -   "amountFormat": "500",                      -   "adjustmentTypeLabel": "Aumenta"                               },              -   {                  -   "s_item_id": 4,                      -   "item_id": 2,                      -   "sub_id": 421527,                      -   "name": "Test 2",                      -   "currency": "CLP",                      -   "amount": 500,                      -   "created_at": "2019-09-26 14:15:41",                      -   "updated_at": "2019-09-26 14:15:41",                      -   "completeAmountFormat": "$ 500 CLP",                      -   "amountFormat": "500",                      -   "adjustmentTypeLabel": "Aumenta"                               },              -   {                  -   "s_item_id": 5,                      -   "item_id": 3,                      -   "sub_id": 421527,                      -   "name": "Test 14",                      -   "currency": "CLP",                      -   "amount": 500,                      -   "created_at": "2019-09-26 14:16:41",                      -   "updated_at": "2019-09-26 14:16:41",                      -   "completeAmountFormat": "$ 500 CLP",                      -   "amountFormat": "500",                      -   "adjustmentTypeLabel": "Aumenta"                               }                   ]       }`

## [](#tag/subscription/paths/~1subscription~1deleteCoupon/post)Elimina un descuento a la suscripción

Este servicio permite eliminar el descuento que tenga la suscripción. El eliminar el descuento de la suscripción, no elimina el descuento que podría tenar asociado el cliente.

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

subscriptionId

required

string

Identificador de la suscripción

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

El objeto Subscription

**400**

Error del Api

**401**

Error de negocio

post/subscription/deleteCoupon

Production server (uses live data)

https://www.flow.cl/api/subscription/deleteCoupon

Sandbox server (uses test data)

https://sandbox.flow.cl/api/subscription/deleteCoupon

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

Expand all Collapse all

`{  -   "subscriptionId": "sus_azcyjj9ycd",      -   "planId": "MiPlanMensual",      -   "plan_name": "Plan mensual",      -   "customerId": "cus_eblcbsua2g",      -   "created": "2018-06-26 17:29:06",      -   "subscription_start": "2018-06-26 17:29:06",      -   "subscription_end": "2019-06-25 00:00:00",      -   "period_start": "2018-06-26 00:00:00",      -   "period_end": "2018-06-26 00:00:00",      -   "next_invoice_date": "2018-06-27 00:00:00",      -   "trial_period_days": 1,      -   "trial_start": "2018-06-26 00:00:00",      -   "trial_end": "2018-06-26 00:00:00",      -   "cancel_at_period_end": 0,      -   "cancel_at": null,      -   "periods_number": 12,      -   "days_until_due": 3,      -   "status": 1,      -   "discount_balance": "20000.0000",      -   "newPlanId": 12,      -   "new_plan_scheduled_change_date": null,      -   "in_new_plan_next_attempt_date": null,      -   "morose": 0,      -   "discount": {          -   "id": 181,              -   "type": "Subscription discount",              -   "created": "2019-12-01 00:00:00",              -   "start": "2019-12-01 00:00:00",              -   "end": "2019-12-31 00:00:00",              -   "deleted": "2019-12-25 00:00:00",              -   "status": 1,              -   "coupon": {                  -   "id": 166,                      -   "name": 166,                      -   "percent_off": 10,                      -   "currency": "CLP",                      -   "amount": 2000,                      -   "created": "2018-07-13 09:57:53",                      -   "duration": 1,                      -   "times": 1,                      -   "max_redemptions": 50,                      -   "expires": "2018-12-31 00:00:00",                      -   "status": 1,                      -   "redemtions": 21                               }                   },      -   "invoices": [          -   {                  -   "id": 1034,                      -   "subscriptionId": "sus_azcyjj9ycd",                      -   "customerId": "cus_eblcbsua2g",                      -   "created": "2018-06-26 17:29:06",                      -   "subject": "PlanPesos - período 2018-06-27 / 2018-06-27",                      -   "currency": "CLP",                      -   "amount": 20000,                      -   "period_start": "2018-06-27 00:00:00",                      -   "period_end": "2018-07-26 00:00:00",                      -   "attemp_count": 0,                      -   "attemped": 1,                      -   "next_attemp_date": "2018-07-27 00:00:00",                      -   "due_date": "2018-06-30 00:00:00",                      -   "status": 0,                      -   "error": 0,                      -   "errorDate": "2018-06-30 00:00:00",                      -   "errorDescription": "The minimum amount is 350 CLP",                      -   "items": [                          -   {                                  -   "id": 567,                                      -   "subject": "PlanPesos - período 2018-06-27 / 2018-06-27",                                      -   "type": 1,                                      -   "currency": "CLP",                                      -   "amount": 20000                                                       }                                           ],                      -   "payment": {                          -   "flowOrder": 3567899,                              -   "commerceOrder": "sf12377",                              -   "requestDate": "2017-07-21 12:32:11",                              -   "status": 1,                              -   "subject": "game console",                              -   "currency": "CLP",                              -   "amount": 12000,                              -   "payer": "pperez@gamil.com",                              -   "optional": {                                  -   "RUT": "7025521-9",                                      -   "ID": "899564778"                                                       },                              -   "pending_info": {                                  -   "media": "Multicaja",                                      -   "date": "2017-07-21 10:30:12"                                                       },                              -   "paymentData": {                                  -   "date": "2017-07-21 12:32:11",                                      -   "media": "webpay",                                      -   "conversionDate": "2017-07-21",                                      -   "conversionRate": 1.1,                                      -   "amount": 12000,                                      -   "currency": "CLP",                                      -   "fee": 551,                                      -   "balance": 11499,                                      -   "transferDate": "2017-07-24"                                                       },                              -   "merchantId": "string"                                           },                      -   "outsidePayment": {                          -   "date": "2021-03-08 00:00:00",                              -   "comment": "Pago por caja"                                           },                      -   "paymentLink": "[https://www.flow.cl/app/web/pay.php?token=7C18C35358FEF0E33C056C719E94956D4FC9BBEL](https://www.flow.cl/app/web/pay.php?token=7C18C35358FEF0E33C056C719E94956D4FC9BBEL)",                      -   "chargeAttemps": [                          -   {                                  -   "id": 901,                                      -   "date": "2018-12-06 15:03:33",                                      -   "customerId": "cus_1uqfm95dch",                                      -   "invoiceId": 1234,                                      -   "commerceOrder": "1883",                                      -   "currency": "CLP",                                      -   "amount": 90000,                                      -   "errorCode": 1605,                                      -   "errorDescription": "This commerceOrder 1883 has been previously paid"                                                       }                                           ]                               }                   ],      -   "planAdditionalList": [          -   {                  -   "s_item_id": 3,                      -   "item_id": 1,                      -   "sub_id": 421527,                      -   "name": "Test",                      -   "currency": "CLP",                      -   "amount": 500,                      -   "created_at": "2019-09-26 14:12:41",                      -   "updated_at": "2019-09-26 14:12:41",                      -   "completeAmountFormat": "$ 500 CLP",                      -   "amountFormat": "500",                      -   "adjustmentTypeLabel": "Aumenta"                               },              -   {                  -   "s_item_id": 4,                      -   "item_id": 2,                      -   "sub_id": 421527,                      -   "name": "Test 2",                      -   "currency": "CLP",                      -   "amount": 500,                      -   "created_at": "2019-09-26 14:15:41",                      -   "updated_at": "2019-09-26 14:15:41",                      -   "completeAmountFormat": "$ 500 CLP",                      -   "amountFormat": "500",                      -   "adjustmentTypeLabel": "Aumenta"                               },              -   {                  -   "s_item_id": 5,                      -   "item_id": 3,                      -   "sub_id": 421527,                      -   "name": "Test 14",                      -   "currency": "CLP",                      -   "amount": 500,                      -   "created_at": "2019-09-26 14:16:41",                      -   "updated_at": "2019-09-26 14:16:41",                      -   "completeAmountFormat": "$ 500 CLP",                      -   "amountFormat": "500",                      -   "adjustmentTypeLabel": "Aumenta"                               }                   ]       }`

## [](#tag/subscription/paths/~1subscription~1addItem/post)Agrega un item adicional a la suscripción

Este servicio permite agregar un item adicional a la suscripción.

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

subscriptionId

required

string

Identificador de la suscripción

itemId

required

number

Identificador del item adicional.

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

El objeto SubscriptionItemChangeResponse

**400**

Error del Api

**401**

Error de negocio

post/subscription/addItem

Production server (uses live data)

https://www.flow.cl/api/subscription/addItem

Sandbox server (uses test data)

https://sandbox.flow.cl/api/subscription/addItem

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "sub_id": "sub_azcyjj9ycd",      -   "item_id": 166,      -   "success": true       }`

## [](#tag/subscription/paths/~1subscription~1deleteItem/post)Elimina un item adicional a la suscripción

Este servicio permite eliminar un item adicional que este agregado en una suscripción.

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

subscriptionId

required

string

Identificador de la suscripción

itemId

required

number

Identificador del item adicional.

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

El objeto SubscriptionItemChangeResponse

**400**

Error del Api

**401**

Error de negocio

post/subscription/deleteItem

Production server (uses live data)

https://www.flow.cl/api/subscription/deleteItem

Sandbox server (uses test data)

https://sandbox.flow.cl/api/subscription/deleteItem

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "sub_id": "sub_azcyjj9ycd",      -   "item_id": 166,      -   "success": true       }`

## [](#tag/subscription/paths/~1subscription~1changePlan/post)Cambia el plan asociado a una suscripción

Este servicio permite modificar el plan que esta asociado a una suscripción. Se puede modificar el plan de una suscripción ingresando de manera opcional una fecha asocial al cambio de plan. Esta fecha deberá estar en el rango del ciclo de facturación actual de la suscripción, y puede ser a futuro.

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

subscriptionId

required

string

Identificador de la suscripción

newPlanId

required

string

Identificador del plan

startDateOfNewPlan

string or null

Fecha en formato (YYYY-mm-dd) de cuando se ejecutara el cambio de plan, debe estar en el rango del ciclo de facturación actual de la suscripción.

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

El objeto SubscriptionChangePlanResponse

**400**

Error del Api

**401**

Error de negocio

post/subscription/changePlan

Production server (uses live data)

https://www.flow.cl/api/subscription/changePlan

Sandbox server (uses test data)

https://sandbox.flow.cl/api/subscription/changePlan

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "start_date_of_new_plan": "2024-10-13",      -   "new_amount": "5000",      -   "new_currency": "CLP",      -   "new_plan_id": "plan superior",      -   "balance": -5000,      -   "old_amount": "10000",      -   "old_currency": "CLP",      -   "old_plan_id": "plan inferior"       }`

## [](#tag/subscription/paths/~1subscription~1changePlanPreview/post)Previsualiza el cambio de plan asociado a una suscripción

Este servicio permite previsualizar el modificar un plan que esta asociado a una suscripción. Se puede modificar el plan de una suscripción ingresando de manera opcional una fecha asocial al cambio de plan. Esta fecha deberá estar en el rango del ciclo de facturación actual de la suscripción, y puede ser a futuro.

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

subscriptionId

required

string

Identificador de la suscripción

newPlanId

required

string

Identificador del plan

startDateOfNewPlan

string or null

Fecha en formato (YYYY-mm-dd) de cuando se ejecutara el cambio de plan, debe estar en el rango del ciclo de facturación actual de la suscripción.

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

El objeto SubscriptionChangePlanPreviewResponse

**400**

Error del Api

**401**

Error de negocio

post/subscription/changePlanPreview

Production server (uses live data)

https://www.flow.cl/api/subscription/changePlanPreview

Sandbox server (uses test data)

https://sandbox.flow.cl/api/subscription/changePlanPreview

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

Expand all Collapse all

`{  -   "balance": {          -   "amount": -5000,              -   "credit_expiration_date": "21-11-2024",              -   "credit_expiration_amount": 2000,              -   "credit_expiration_warning": "The remaining credit will not be fully used in the remaining billing periods."                   },      -   "balance2": -5000,      -   "next_invoice_date": "11-11-2024",      -   "old_plan": {          -   "name": "plan inferior 3",              -   "currency": "CLP",              -   "amount": "10000",              -   "interval": 3,              -   "interval_count": 1,              -   "periods_number": null                   },      -   "new_plan": {          -   "name": "plan inferior 4",              -   "currency": "CLP",              -   "amount": "5000",              -   "interval": 3,              -   "interval_count": 1,              -   "periods_number": null                   }       }`

## [](#tag/subscription/paths/~1subscription~1changePlanCancel/post)Cancela un cambio de plan programado asociado a una suscripción

Este servicio permite cancelar un cambio de plan que haya sido programado para una suscripción.

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

subscriptionId

required

string

Identificador de la suscripción

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

El objeto SubscriptionChangePlanCancelResponse

**400**

Error del Api

**401**

Error de negocio

post/subscription/changePlanCancel

Production server (uses live data)

https://www.flow.cl/api/subscription/changePlanCancel

Sandbox server (uses test data)

https://sandbox.flow.cl/api/subscription/changePlanCancel

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "success": true       }`

# [](#tag/subscription_items)subscription_items

Permite asociar items adicionales a suscripciones.

## [](#tag/subscription_items/paths/~1subscription_item~1create/post)Crea un item adicional de suscripción

Este servicio permite crear un nuevo item adicional de suscripción

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

name

required

string

Nombre del item adicional

currency

required

string

Moneda del item adicional.

amount

required

number

Monto del item adicional, si es negativo es un descuento, si es positivo un recargo

s

required

string

la firma de los parámetros efectuada con su secretKey.

### Responses

**200**

El objeto ItemAdditional

**400**

Error del Api

**401**

Error de negocio

post/subscription_item/create

Production server (uses live data)

https://www.flow.cl/api/subscription\_item/create

Sandbox server (uses test data)

https://sandbox.flow.cl/api/subscription\_item/create

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "id": 166,      -   "name": 166,      -   "amount": 5000,      -   "currency": "CLP",      -   "associatedSubscriptionsCount": 1,      -   "status": 1,      -   "created": "2018-07-13 09:57:53"       }`

## [](#tag/subscription_items/paths/~1subscription_item~1get/get)Obtiene un item adicional de suscripción

Este servicio permite obtener los datos de un item adicional de suscripción

##### query Parameters

apiKey

required

string

apiKey del comercio

itemId

required

string

Identificador del item adicional

s

required

string

la firma de los parámetros efectuada con su secretKey.

### Responses

**200**

El objeto ItemAdditional

**400**

Error del Api

**401**

Error de negocio

get/subscription_item/get

Production server (uses live data)

https://www.flow.cl/api/subscription\_item/get

Sandbox server (uses test data)

https://sandbox.flow.cl/api/subscription\_item/get

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "id": 166,      -   "name": 166,      -   "amount": 5000,      -   "currency": "CLP",      -   "associatedSubscriptionsCount": 1,      -   "status": 1,      -   "created": "2018-07-13 09:57:53"       }`

## [](#tag/subscription_items/paths/~1subscription_item~1edit/post)Edita un item adicional de suscripción

Este servicio permite editar un item adicional de suscripción. Se puede editar el nombre, tipo de ajuste, monto y definir si aplica para las suscripciones actuales o solo las futuras.

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

itemId

required

string

Identificador del item adicional

name

string

Nombre del item adicional

amount

number

Monto del item adicional, si es negativo es un descuento, si es positivo un recargo

changeType

string

Requerido si name o amount es enviado.

Tipo de cambio:

- to_future Solo para suscripciones futuras.
- all Actualiza para las suscripciones actuales y futuras.

s

required

string

la firma de los parámetros efectuada con su secretKey.

### Responses

**200**

El objeto ItemAdditional

**400**

Error del Api

**401**

Error de negocio

post/subscription_item/edit

Production server (uses live data)

https://www.flow.cl/api/subscription\_item/edit

Sandbox server (uses test data)

https://sandbox.flow.cl/api/subscription\_item/edit

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "id": 166,      -   "name": 166,      -   "amount": 5000,      -   "currency": "CLP",      -   "associatedSubscriptionsCount": 1,      -   "status": 1,      -   "created": "2018-07-13 09:57:53"       }`

## [](#tag/subscription_items/paths/~1subscription_item~1delete/post)Elimina un item adicional de suscripción

Este servicio permite eliminar un item adicional de suscripción. Eliminar un item adicional de suscripción posee 2 tipos de eliminación: solo para suscripciones futuras o para todas las suscripciones que actualmente poseen asociado este item.

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

itemId

required

string

Identificado del item adicional

changeType

required

string

Tipo de eliminación:

- to_future Solo elimina para suscripciones futuras.
- all Elimina para las suscripciones actuales y futuras.

s

required

string

la firma de los parámetros efectuada con su secretKey.

### Responses

**200**

El objeto ItemAdditional

**400**

Error del Api

**401**

Error de negocio

post/subscription_item/delete

Production server (uses live data)

https://www.flow.cl/api/subscription\_item/delete

Sandbox server (uses test data)

https://sandbox.flow.cl/api/subscription\_item/delete

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "id": 166,      -   "name": 166,      -   "amount": 5000,      -   "currency": "CLP",      -   "associatedSubscriptionsCount": 1,      -   "status": 1,      -   "created": "2018-07-13 09:57:53"       }`

## [](#tag/subscription_items/paths/~1subscription_item~1list/get)Lista los items adicionales de suscripción

Este servicio permite la lista de items adicionales de suscripción

##### query Parameters

apiKey

required

string

apiKey del comercio

start

integer

Número de registro de inicio de la página. Si se omite el valor por omisión es 0.

limit

integer

Número de registros por página. Si se omite el valor por omisón es 10. El valor máximo es de 100 registros por página.

filter

string

Filtro por el nombre del item adicional

status

integer

Filtro por el estado del item adicional:

- 1 Activo
- 0 Inactivo

s

required

string

la firma de los parámetros efectuada con su secretKey.

### Responses

**200**

El objeto ItemAdditional

**400**

Error del Api

**401**

Error de negocio

get/subscription_item/list

Production server (uses live data)

https://www.flow.cl/api/subscription\_item/list

Sandbox server (uses test data)

https://sandbox.flow.cl/api/subscription\_item/list

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "total": 200,      -   "hasMore": 1,      -   "data": "[{item list 1}{item list 2}{item list n..}"       }`

# [](#tag/coupon)coupon

Permite crear cupones de descuento para ser aplicados a suscripciones o clientes

## [](#tag/coupon/paths/~1coupon~1create/post)Crea un cupón de descuento

Este servicio permite crear un cupón de descuento

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

name

required

string

Nombre del cupón

percent_off

number

Porcentaje del cupon. Número entre 0 y 100. Permite 2 decimales con punto decimal. Ejemplo 10.2. No se agrega el signo %

currency

string

Moneda del descuento. Solo agregue la moneda para cupones de monto.

amount

number

Monto del descuento

duration

number

Duración del cupón:

- 1 definida
- 0 indefinida

times

number

Si la duración del cupón es definida, este campo indica las veces de duración del cupón. Si el cupón se aplica a un cliente veces corresponderá a meses. Si l cupón se aplica a una suscripción, veces corresponderá a los períodos del Plan.

max_redemptions

number

Número de veces de aplicación del cupón.

expires

string

Fecha de expiración del cupón en formato yyyy-mm-dd

s

required

string

la firma de los parámetros efectuada con su secretKey.

### Responses

**200**

El objeto Coupon

**400**

Error del Api

**401**

Error de negocio

post/coupon/create

Production server (uses live data)

https://www.flow.cl/api/coupon/create

Sandbox server (uses test data)

https://sandbox.flow.cl/api/coupon/create

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "id": 166,      -   "name": 166,      -   "percent_off": 10,      -   "currency": "CLP",      -   "amount": 2000,      -   "created": "2018-07-13 09:57:53",      -   "duration": 1,      -   "times": 1,      -   "max_redemptions": 50,      -   "expires": "2018-12-31 00:00:00",      -   "status": 1,      -   "redemtions": 21       }`

## [](#tag/coupon/paths/~1coupon~1edit/post)Edita un cupón de descuento

Este servicio permite editar un cupón de descuento. Sólo se puede editar el nombre de un cupón.

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

couponId

required

string

Identificador del cupón

name

required

string

Nombre del cupón

s

required

string

la firma de los parámetros efectuada con su secretKey.

### Responses

**200**

El objeto Coupon

**400**

Error del Api

**401**

Error de negocio

post/coupon/edit

Production server (uses live data)

https://www.flow.cl/api/coupon/edit

Sandbox server (uses test data)

https://sandbox.flow.cl/api/coupon/edit

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "id": 166,      -   "name": 166,      -   "percent_off": 10,      -   "currency": "CLP",      -   "amount": 2000,      -   "created": "2018-07-13 09:57:53",      -   "duration": 1,      -   "times": 1,      -   "max_redemptions": 50,      -   "expires": "2018-12-31 00:00:00",      -   "status": 1,      -   "redemtions": 21       }`

## [](#tag/coupon/paths/~1coupon~1delete/post)Elimina un cupón de descuento

Este servicio permite eliminar un cupón de descuento. Eliminar un cupón de descuento no elimina los descuentos aplicados a clientes o suscripciones, sólo no permite volver a aplicar este cupón

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

couponId

required

string

Identificado del cupón

s

required

string

la firma de los parámetros efectuada con su secretKey.

### Responses

**200**

El objeto Coupon

**400**

Error del Api

**401**

Error de negocio

post/coupon/delete

Production server (uses live data)

https://www.flow.cl/api/coupon/delete

Sandbox server (uses test data)

https://sandbox.flow.cl/api/coupon/delete

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "id": 166,      -   "name": 166,      -   "percent_off": 10,      -   "currency": "CLP",      -   "amount": 2000,      -   "created": "2018-07-13 09:57:53",      -   "duration": 1,      -   "times": 1,      -   "max_redemptions": 50,      -   "expires": "2018-12-31 00:00:00",      -   "status": 1,      -   "redemtions": 21       }`

## [](#tag/coupon/paths/~1coupon~1get/get)Obtiene un cupón de descuento

Este servicio permite obtener los datos de un cupón de descuento

##### query Parameters

apiKey

required

string

apiKey del comercio

couponId

required

string

Identificador del cupón

s

required

string

la firma de los parámetros efectuada con su secretKey.

### Responses

**200**

El objeto Coupon

**400**

Error del Api

**401**

Error de negocio

get/coupon/get

Production server (uses live data)

https://www.flow.cl/api/coupon/get

Sandbox server (uses test data)

https://sandbox.flow.cl/api/coupon/get

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "id": 166,      -   "name": 166,      -   "percent_off": 10,      -   "currency": "CLP",      -   "amount": 2000,      -   "created": "2018-07-13 09:57:53",      -   "duration": 1,      -   "times": 1,      -   "max_redemptions": 50,      -   "expires": "2018-12-31 00:00:00",      -   "status": 1,      -   "redemtions": 21       }`

## [](#tag/coupon/paths/~1coupon~1list/get)Lista los cupones de descuento

Este servicio permite la lista de cupones de descuento

##### query Parameters

apiKey

required

string

apiKey del comercio

start

integer

Número de registro de inicio de la página. Si se omite el valor por omisión es 0.

limit

integer

Número de registros por página. Si se omite el valor por omisón es 10. El valor máximo es de 100 registros por página.

filter

string

Filtro por el nombre del cupón

status

integer

Filtro por el estado del cupón:

- 1 Activo
- 0 Inactivo

s

required

string

la firma de los parámetros efectuada con su secretKey.

### Responses

**200**

El objeto Coupon

**400**

Error del Api

**401**

Error de negocio

get/coupon/list

Production server (uses live data)

https://www.flow.cl/api/coupon/list

Sandbox server (uses test data)

https://sandbox.flow.cl/api/coupon/list

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "total": 200,      -   "hasMore": 1,      -   "data": "[{item list 1}{item list 2}{item list n..}"       }`

# [](#tag/invoice)invoice

Permite obtener los importes que se han generado por medio de las suscripciones.

## [](#tag/invoice/paths/~1invoice~1get/get)Obtiene los datos de un Invoice (Importe)

Este servicio permite obtener los datos de un Importe.

##### query Parameters

apiKey

required

string

apiKey del comercio

invoiceId

required

number

Identificador del Invoice

s

required

string

la firma de los parámetros efectuada con su secretKey.

### Responses

**200**

El objeto Invoice

**400**

Error del Api

**401**

Error de negocio

get/invoice/get

Production server (uses live data)

https://www.flow.cl/api/invoice/get

Sandbox server (uses test data)

https://sandbox.flow.cl/api/invoice/get

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

Expand all Collapse all

`{  -   "id": 1034,      -   "subscriptionId": "sus_azcyjj9ycd",      -   "customerId": "cus_eblcbsua2g",      -   "created": "2018-06-26 17:29:06",      -   "subject": "PlanPesos - período 2018-06-27 / 2018-06-27",      -   "currency": "CLP",      -   "amount": 20000,      -   "period_start": "2018-06-27 00:00:00",      -   "period_end": "2018-07-26 00:00:00",      -   "attemp_count": 0,      -   "attemped": 1,      -   "next_attemp_date": "2018-07-27 00:00:00",      -   "due_date": "2018-06-30 00:00:00",      -   "status": 0,      -   "error": 0,      -   "errorDate": "2018-06-30 00:00:00",      -   "errorDescription": "The minimum amount is 350 CLP",      -   "items": [          -   {                  -   "id": 567,                      -   "subject": "PlanPesos - período 2018-06-27 / 2018-06-27",                      -   "type": 1,                      -   "currency": "CLP",                      -   "amount": 20000                               }                   ],      -   "payment": {          -   "flowOrder": 3567899,              -   "commerceOrder": "sf12377",              -   "requestDate": "2017-07-21 12:32:11",              -   "status": 1,              -   "subject": "game console",              -   "currency": "CLP",              -   "amount": 12000,              -   "payer": "pperez@gamil.com",              -   "optional": {                  -   "RUT": "7025521-9",                      -   "ID": "899564778"                               },              -   "pending_info": {                  -   "media": "Multicaja",                      -   "date": "2017-07-21 10:30:12"                               },              -   "paymentData": {                  -   "date": "2017-07-21 12:32:11",                      -   "media": "webpay",                      -   "conversionDate": "2017-07-21",                      -   "conversionRate": 1.1,                      -   "amount": 12000,                      -   "currency": "CLP",                      -   "fee": 551,                      -   "balance": 11499,                      -   "transferDate": "2017-07-24"                               },              -   "merchantId": "string"                   },      -   "outsidePayment": {          -   "date": "2021-03-08 00:00:00",              -   "comment": "Pago por caja"                   },      -   "paymentLink": "[https://www.flow.cl/app/web/pay.php?token=7C18C35358FEF0E33C056C719E94956D4FC9BBEL](https://www.flow.cl/app/web/pay.php?token=7C18C35358FEF0E33C056C719E94956D4FC9BBEL)",      -   "chargeAttemps": [          -   {                  -   "id": 901,                      -   "date": "2018-12-06 15:03:33",                      -   "customerId": "cus_1uqfm95dch",                      -   "invoiceId": 1234,                      -   "commerceOrder": "1883",                      -   "currency": "CLP",                      -   "amount": 90000,                      -   "errorCode": 1605,                      -   "errorDescription": "This commerceOrder 1883 has been previously paid"                               }                   ]       }`

## [](#tag/invoice/paths/~1invoice~1cancel/post)Cancela un Importe (Invoice) pendiente de pago

Este servicio permite cancelar un Importe (Invoice) pendiente de pago.

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

invoiceId

required

number

Identificador del Invoice (Importe)

s

required

string

la firma de los parámetros efectuada con su secretKey.

### Responses

**200**

El objeto Invoice

**400**

Error del Api

**401**

Error de negocio

post/invoice/cancel

Production server (uses live data)

https://www.flow.cl/api/invoice/cancel

Sandbox server (uses test data)

https://sandbox.flow.cl/api/invoice/cancel

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

Expand all Collapse all

`{  -   "id": 1034,      -   "subscriptionId": "sus_azcyjj9ycd",      -   "customerId": "cus_eblcbsua2g",      -   "created": "2018-06-26 17:29:06",      -   "subject": "PlanPesos - período 2018-06-27 / 2018-06-27",      -   "currency": "CLP",      -   "amount": 20000,      -   "period_start": "2018-06-27 00:00:00",      -   "period_end": "2018-07-26 00:00:00",      -   "attemp_count": 0,      -   "attemped": 1,      -   "next_attemp_date": "2018-07-27 00:00:00",      -   "due_date": "2018-06-30 00:00:00",      -   "status": 0,      -   "error": 0,      -   "errorDate": "2018-06-30 00:00:00",      -   "errorDescription": "The minimum amount is 350 CLP",      -   "items": [          -   {                  -   "id": 567,                      -   "subject": "PlanPesos - período 2018-06-27 / 2018-06-27",                      -   "type": 1,                      -   "currency": "CLP",                      -   "amount": 20000                               }                   ],      -   "payment": {          -   "flowOrder": 3567899,              -   "commerceOrder": "sf12377",              -   "requestDate": "2017-07-21 12:32:11",              -   "status": 1,              -   "subject": "game console",              -   "currency": "CLP",              -   "amount": 12000,              -   "payer": "pperez@gamil.com",              -   "optional": {                  -   "RUT": "7025521-9",                      -   "ID": "899564778"                               },              -   "pending_info": {                  -   "media": "Multicaja",                      -   "date": "2017-07-21 10:30:12"                               },              -   "paymentData": {                  -   "date": "2017-07-21 12:32:11",                      -   "media": "webpay",                      -   "conversionDate": "2017-07-21",                      -   "conversionRate": 1.1,                      -   "amount": 12000,                      -   "currency": "CLP",                      -   "fee": 551,                      -   "balance": 11499,                      -   "transferDate": "2017-07-24"                               },              -   "merchantId": "string"                   },      -   "outsidePayment": {          -   "date": "2021-03-08 00:00:00",              -   "comment": "Pago por caja"                   },      -   "paymentLink": "[https://www.flow.cl/app/web/pay.php?token=7C18C35358FEF0E33C056C719E94956D4FC9BBEL](https://www.flow.cl/app/web/pay.php?token=7C18C35358FEF0E33C056C719E94956D4FC9BBEL)",      -   "chargeAttemps": [          -   {                  -   "id": 901,                      -   "date": "2018-12-06 15:03:33",                      -   "customerId": "cus_1uqfm95dch",                      -   "invoiceId": 1234,                      -   "commerceOrder": "1883",                      -   "currency": "CLP",                      -   "amount": 90000,                      -   "errorCode": 1605,                      -   "errorDescription": "This commerceOrder 1883 has been previously paid"                               }                   ]       }`

## [](#tag/invoice/paths/~1invoice~1outsidePayment/post)Ingresa un pago por fuera y da por pagado el Importe (Invoice)

Este servicio permite dar por pagado un Importe (Invoice) cuando el pago no se realiza por Flow.

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

invoiceId

required

number

Identificador del Invoice (Importe)

date

required

string

Fecha del pago en formato "yyyy-mm-dd"

comment

string

descripción del pago por fuera

s

required

string

la firma de los parámetros efectuada con su secretKey.

### Responses

**200**

El objeto Invoice

**400**

Error del Api

**401**

Error de negocio

post/invoice/outsidePayment

Production server (uses live data)

https://www.flow.cl/api/invoice/outsidePayment

Sandbox server (uses test data)

https://sandbox.flow.cl/api/invoice/outsidePayment

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

Expand all Collapse all

`{  -   "id": 1034,      -   "subscriptionId": "sus_azcyjj9ycd",      -   "customerId": "cus_eblcbsua2g",      -   "created": "2018-06-26 17:29:06",      -   "subject": "PlanPesos - período 2018-06-27 / 2018-06-27",      -   "currency": "CLP",      -   "amount": 20000,      -   "period_start": "2018-06-27 00:00:00",      -   "period_end": "2018-07-26 00:00:00",      -   "attemp_count": 0,      -   "attemped": 1,      -   "next_attemp_date": "2018-07-27 00:00:00",      -   "due_date": "2018-06-30 00:00:00",      -   "status": 0,      -   "error": 0,      -   "errorDate": "2018-06-30 00:00:00",      -   "errorDescription": "The minimum amount is 350 CLP",      -   "items": [          -   {                  -   "id": 567,                      -   "subject": "PlanPesos - período 2018-06-27 / 2018-06-27",                      -   "type": 1,                      -   "currency": "CLP",                      -   "amount": 20000                               }                   ],      -   "payment": {          -   "flowOrder": 3567899,              -   "commerceOrder": "sf12377",              -   "requestDate": "2017-07-21 12:32:11",              -   "status": 1,              -   "subject": "game console",              -   "currency": "CLP",              -   "amount": 12000,              -   "payer": "pperez@gamil.com",              -   "optional": {                  -   "RUT": "7025521-9",                      -   "ID": "899564778"                               },              -   "pending_info": {                  -   "media": "Multicaja",                      -   "date": "2017-07-21 10:30:12"                               },              -   "paymentData": {                  -   "date": "2017-07-21 12:32:11",                      -   "media": "webpay",                      -   "conversionDate": "2017-07-21",                      -   "conversionRate": 1.1,                      -   "amount": 12000,                      -   "currency": "CLP",                      -   "fee": 551,                      -   "balance": 11499,                      -   "transferDate": "2017-07-24"                               },              -   "merchantId": "string"                   },      -   "outsidePayment": {          -   "date": "2021-03-08 00:00:00",              -   "comment": "Pago por caja"                   },      -   "paymentLink": "[https://www.flow.cl/app/web/pay.php?token=7C18C35358FEF0E33C056C719E94956D4FC9BBEL](https://www.flow.cl/app/web/pay.php?token=7C18C35358FEF0E33C056C719E94956D4FC9BBEL)",      -   "chargeAttemps": [          -   {                  -   "id": 901,                      -   "date": "2018-12-06 15:03:33",                      -   "customerId": "cus_1uqfm95dch",                      -   "invoiceId": 1234,                      -   "commerceOrder": "1883",                      -   "currency": "CLP",                      -   "amount": 90000,                      -   "errorCode": 1605,                      -   "errorDescription": "This commerceOrder 1883 has been previously paid"                               }                   ]       }`

## [](#tag/invoice/paths/~1invoice~1getOverDue/get)Obtiene los invoices vencidos

Este servicio permite obtener la lista de invoices vencidos, es decir, aquellos no pagados cuyo due_date este vencido.

##### query Parameters

apiKey

required

string

apiKey del comercio

start

integer

Número de registro de inicio de la página. Si se omite el valor por omisión es 0.

limit

integer

Número de registros por página. Si se omite el valor por omisón es 10. El valor máximo es de 100 registros por página.

filter

string

Filtro por asunto del Invoice (Importe).

planId

string

Identificador del Plan, si se agrega se filtrará para los invoices de este plan.

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

Lista paginada de Invoices vencidos

**400**

Error del Api

**401**

Error de negocio

get/invoice/getOverDue

Production server (uses live data)

https://www.flow.cl/api/invoice/getOverDue

Sandbox server (uses test data)

https://sandbox.flow.cl/api/invoice/getOverDue

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "total": 200,      -   "hasMore": 1,      -   "data": "[{item list 1}{item list 2}{item list n..}"       }`

## [](#tag/invoice/paths/~1invoice~1retryToCollect/post)Reintenta el cobro de un invoice vencido

Este servicio permite reintentar el cobro de un Invoice vencido.

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

invoiceId

required

number

Identificador del Invoice (Importe)

s

required

string

la firma de los parámetros efectuada con su secretKey.

### Responses

**200**

El objeto Invoice

**400**

Error del Api

**401**

Error de negocio

post/invoice/retryToCollect

Production server (uses live data)

https://www.flow.cl/api/invoice/retryToCollect

Sandbox server (uses test data)

https://sandbox.flow.cl/api/invoice/retryToCollect

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

Expand all Collapse all

`{  -   "id": 1034,      -   "subscriptionId": "sus_azcyjj9ycd",      -   "customerId": "cus_eblcbsua2g",      -   "created": "2018-06-26 17:29:06",      -   "subject": "PlanPesos - período 2018-06-27 / 2018-06-27",      -   "currency": "CLP",      -   "amount": 20000,      -   "period_start": "2018-06-27 00:00:00",      -   "period_end": "2018-07-26 00:00:00",      -   "attemp_count": 0,      -   "attemped": 1,      -   "next_attemp_date": "2018-07-27 00:00:00",      -   "due_date": "2018-06-30 00:00:00",      -   "status": 0,      -   "error": 0,      -   "errorDate": "2018-06-30 00:00:00",      -   "errorDescription": "The minimum amount is 350 CLP",      -   "items": [          -   {                  -   "id": 567,                      -   "subject": "PlanPesos - período 2018-06-27 / 2018-06-27",                      -   "type": 1,                      -   "currency": "CLP",                      -   "amount": 20000                               }                   ],      -   "payment": {          -   "flowOrder": 3567899,              -   "commerceOrder": "sf12377",              -   "requestDate": "2017-07-21 12:32:11",              -   "status": 1,              -   "subject": "game console",              -   "currency": "CLP",              -   "amount": 12000,              -   "payer": "pperez@gamil.com",              -   "optional": {                  -   "RUT": "7025521-9",                      -   "ID": "899564778"                               },              -   "pending_info": {                  -   "media": "Multicaja",                      -   "date": "2017-07-21 10:30:12"                               },              -   "paymentData": {                  -   "date": "2017-07-21 12:32:11",                      -   "media": "webpay",                      -   "conversionDate": "2017-07-21",                      -   "conversionRate": 1.1,                      -   "amount": 12000,                      -   "currency": "CLP",                      -   "fee": 551,                      -   "balance": 11499,                      -   "transferDate": "2017-07-24"                               },              -   "merchantId": "string"                   },      -   "outsidePayment": {          -   "date": "2021-03-08 00:00:00",              -   "comment": "Pago por caja"                   },      -   "paymentLink": "[https://www.flow.cl/app/web/pay.php?token=7C18C35358FEF0E33C056C719E94956D4FC9BBEL](https://www.flow.cl/app/web/pay.php?token=7C18C35358FEF0E33C056C719E94956D4FC9BBEL)",      -   "chargeAttemps": [          -   {                  -   "id": 901,                      -   "date": "2018-12-06 15:03:33",                      -   "customerId": "cus_1uqfm95dch",                      -   "invoiceId": 1234,                      -   "commerceOrder": "1883",                      -   "currency": "CLP",                      -   "amount": 90000,                      -   "errorCode": 1605,                      -   "errorDescription": "This commerceOrder 1883 has been previously paid"                               }                   ]       }`

# [](#tag/settlement)settlement

Permite obtener las liquidaciones de pagos efectuadas por Flow

## [](#tag/settlement/paths/~1settlement~1getByDate/get)Obtiene la liquidación efectuada para esa fecha. Deprecated

Este método se utiliza para obtener la liquidación de la fecha enviada como parámetro.  
Nota: Si su liquidación es anterior al 01-06-2021 utilizar este servicio, en caso contrario se recomienda utilizar el servicio /settlement/search

##### query Parameters

apiKey

required

string

apiKey del comercio

date

required

string <yyyy-mm-dd>

Fecha de la liquidación

s

required

string

la firma de los parámetros efectuada con su secretKey.

### Responses

**200**

Arreglo de objetos Settlement

**400**

Error del Api

**401**

Error de negocio

get/settlement/getByDate

Production server (uses live data)

https://www.flow.cl/api/settlement/getByDate

Sandbox server (uses test data)

https://sandbox.flow.cl/api/settlement/getByDate

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

Expand all Collapse all

`[  -   {          -   "id": 1001,              -   "date": "2018-06-15",              -   "rut": "9999999-9",              -   "name": "Francisco Castillo",              -   "email": "fcastillo@gmail.com",              -   "initialBalance": -1000,              -   "transferred": 120000,              -   "billed": 2164,              -   "finalBalance": 0,              -   "enterprise": "N",              -   "transferredSummary": [                  -   {                          -   "item": "Comisión de pagos recibidos",                              -   "amount": -1000,                              -   "taxes": -190                                           }                               ],              -   "billedSummary": [                  -   {                          -   "item": "Comisión de pagos recibidos",                              -   "amount": -1000,                              -   "taxes": -190                                           }                               ],              -   "transfersDetail": [                  -   {                          -   "date": "2018-06-15",                              -   "name": "Francisco Castillo",                              -   "bank": "Banco de Chile - Edwards",                              -   "account": "001456700900",                              -   "type": "Cuenta corriente",                              -   "rut": "9999999-9",                              -   "email": "fcastillo@gmail.com",                              -   "amount": 120000,                              -   "status": "Transferida"                                           }                               ],              -   "paymentsDetail": [                  -   {                          -   "id": 3879654,                              -   "date": "2018-06-12 16:13:39",                              -   "subject": "Orden 13455 Castillo.cl",                              -   "media": "Multicaja",                              -   "amount": 53500,                              -   "rate": 3.35,                              -   "fee": 1960                                           }                               ],              -   "generalReturnsDetail": [                  -   {                          -   "id": 101,                              -   "date": "2018-06-08 17:15:33",                              -   "subject": "Dif IVA retenido/facturado fact 1345",                              -   "amount": 100                                           }                               ],              -   "refundReturnsDetail": [                  -   {                          -   "id": 222,                              -   "date": "2018-05-04 11:47:11",                              -   "receiverEmail": "fcastillo@gmail.com",                              -   "paymentId": 3654771,                              -   "amount": 2000,                              -   "fee": 202                                           }                               ],              -   "refundWithholdingDetail": [                  -   {                          -   "id": 222,                              -   "date": "2018-05-04 11:47:11",                              -   "receiverEmail": "fcastillo@gmail.com",                              -   "paymentId": 3654771,                              -   "amount": 2000,                              -   "fee": 202                                           }                               ],              -   "generalWithholdingDetail": [                  -   {                          -   "id": 101,                              -   "date": "2018-06-08 17:15:33",                              -   "subject": "Dif IVA retenido/facturado fact 1345",                              -   "amount": 100                                           }                               ],              -   "refundBilledDetail": [                  -   {                          -   "id": 222,                              -   "date": "2018-05-04 11:47:11",                              -   "receiverEmail": "fcastillo@gmail.com",                              -   "paymentId": 3654771,                              -   "amount": 2000,                              -   "fee": 202                                           }                               ]                   }       ]`

## [](#tag/settlement/paths/~1settlement~1getById/get)Obtiene la Liquidación efectuada con ese identificador Deprecated

Este método se utiliza para obtener el objeto Settlement correspondiente al identificador.  
Nota: Si su liquidación es anterior al 01-06-2021 utilizar este servicio, en caso contrario se recomienda utilizar el servicio /settlement/getByIdv2

##### query Parameters

apiKey

required

string

apiKey del comercio

id

required

string

Identificador de la liquidación

s

required

string

la firma de los parámetros efectuada con su secretKey.

### Responses

**200**

El objeto Settlement

**400**

Error del Api

**401**

Error de negocio

get/settlement/getById

Production server (uses live data)

https://www.flow.cl/api/settlement/getById

Sandbox server (uses test data)

https://sandbox.flow.cl/api/settlement/getById

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

Expand all Collapse all

`{  -   "id": 1001,      -   "date": "2018-06-15",      -   "rut": "9999999-9",      -   "name": "Francisco Castillo",      -   "email": "fcastillo@gmail.com",      -   "initialBalance": -1000,      -   "transferred": 120000,      -   "billed": 2164,      -   "finalBalance": 0,      -   "enterprise": "N",      -   "transferredSummary": [          -   {                  -   "item": "Comisión de pagos recibidos",                      -   "amount": -1000,                      -   "taxes": -190                               }                   ],      -   "billedSummary": [          -   {                  -   "item": "Comisión de pagos recibidos",                      -   "amount": -1000,                      -   "taxes": -190                               }                   ],      -   "transfersDetail": [          -   {                  -   "date": "2018-06-15",                      -   "name": "Francisco Castillo",                      -   "bank": "Banco de Chile - Edwards",                      -   "account": "001456700900",                      -   "type": "Cuenta corriente",                      -   "rut": "9999999-9",                      -   "email": "fcastillo@gmail.com",                      -   "amount": 120000,                      -   "status": "Transferida"                               }                   ],      -   "paymentsDetail": [          -   {                  -   "id": 3879654,                      -   "date": "2018-06-12 16:13:39",                      -   "subject": "Orden 13455 Castillo.cl",                      -   "media": "Multicaja",                      -   "amount": 53500,                      -   "rate": 3.35,                      -   "fee": 1960                               }                   ],      -   "generalReturnsDetail": [          -   {                  -   "id": 101,                      -   "date": "2018-06-08 17:15:33",                      -   "subject": "Dif IVA retenido/facturado fact 1345",                      -   "amount": 100                               }                   ],      -   "refundReturnsDetail": [          -   {                  -   "id": 222,                      -   "date": "2018-05-04 11:47:11",                      -   "receiverEmail": "fcastillo@gmail.com",                      -   "paymentId": 3654771,                      -   "amount": 2000,                      -   "fee": 202                               }                   ],      -   "refundWithholdingDetail": [          -   {                  -   "id": 222,                      -   "date": "2018-05-04 11:47:11",                      -   "receiverEmail": "fcastillo@gmail.com",                      -   "paymentId": 3654771,                      -   "amount": 2000,                      -   "fee": 202                               }                   ],      -   "generalWithholdingDetail": [          -   {                  -   "id": 101,                      -   "date": "2018-06-08 17:15:33",                      -   "subject": "Dif IVA retenido/facturado fact 1345",                      -   "amount": 100                               }                   ],      -   "refundBilledDetail": [          -   {                  -   "id": 222,                      -   "date": "2018-05-04 11:47:11",                      -   "receiverEmail": "fcastillo@gmail.com",                      -   "paymentId": 3654771,                      -   "amount": 2000,                      -   "fee": 202                               }                   ]       }`

## [](#tag/settlement/paths/~1settlement~1search/get)Busca liquidaciones en el un determinado rango de fechas.

Este método se utiliza para obtener el(los) encabezado(s) de liquidación(es) dentro del rango de fechas ingresado (permite filtrar también por la moneda). Para obtener la liquidación completa (encabezado y detalles) utilizar el servicio /settlement/getByIdv2

##### query Parameters

apiKey

required

string

apiKey del comercio

startDate

required

string <yyyy-mm-dd>

Fecha inicio de rango

endDate

required

string <yyyy-mm-dd>

Fecha fin de rango

currency

string

Moneda de liquidación

enterprise

string

Tipo empresa:

- R: Regulada
- N: No regulada

s

required

string

la firma de los parámetros efectuada con su secretKey.

### Responses

**200**

Arreglo de objetos SettlementBase

**400**

Error del Api

**401**

Error de negocio

get/settlement/search

Production server (uses live data)

https://www.flow.cl/api/settlement/search

Sandbox server (uses test data)

https://sandbox.flow.cl/api/settlement/search

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

Expand all Collapse all

`[  -   {          -   "id": 1001,              -   "date": "2018-06-15",              -   "taxId": "9999999-9",              -   "name": "John Doe",              -   "email": "johndoe@flow.cl",              -   "currency": "CLP",              -   "initial_balance": 0,              -   "final_balance": 0,              -   "transferred": 0,              -   "billed": 0,              -   "enterprise": "N"                   }       ]`

## [](#tag/settlement/paths/~1settlement~1getByIdv2/get)Obtiene la liquidación efectuada con ese identificador en el formato nuevo

Este método se utiliza para obtener el objeto Settlement correspondiente al identificador

##### query Parameters

apiKey

required

string

apiKey del comercio

id

required

string

Identificador de la liquidación

s

required

string

la firma de los parámetros efectuada con su secretKey.

### Responses

**200**

El objeto SettlementV2

**400**

Error del Api

**401**

Error de negocio

get/settlement/getByIdv2

Production server (uses live data)

https://www.flow.cl/api/settlement/getByIdv2

Sandbox server (uses test data)

https://sandbox.flow.cl/api/settlement/getByIdv2

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

Expand all Collapse all

`{  -   "id": 1001,      -   "date": "2018-06-15",      -   "taxId": "9999999-9",      -   "name": "John Doe",      -   "email": "johndoe@flow.cl",      -   "currency": "CLP",      -   "initial_balance": 0,      -   "final_balance": 0,      -   "transferred": 0,      -   "billed": 0,      -   "enterprise": "N",      -   "summary": {          -   "transferred": [                  -   {                          -   "item": "Comisión de pagos recibidos",                              -   "amount": -1000,                              -   "taxes": -190                                           }                               ],              -   "commission": [                  -   {                          -   "type": "Comisión de pagos",                              -   "amount": 1000,                              -   "taxes": 190,                              -   "total": 1200                                           }                               ],              -   "payment": [                  -   {                          -   "paymentMethod": "Webpay",                              -   "brand": "Visa",                              -   "operations": 100,                              -   "amount": 2000,                              -   "rate": 4.19,                              -   "fixed": 100,                              -   "commission": 83.8,                              -   "taxes": 15.9,                              -   "balance": 1900.3                                           }                               ],              -   "credit": [                  -   {                          -   "amount": 1000,                              -   "commission": 10,                              -   "taxes": 190,                              -   "balance": 1200,                              -   "operations": 100,                              -   "type": "Devolución Solicitada por el Comercio"                                           }                               ],              -   "debit": [                  -   {                          -   "amount": 1000,                              -   "commission": 10,                              -   "taxes": 190,                              -   "balance": 1200,                              -   "operations": 100,                              -   "type": "Reembolsos"                                           }                               ],              -   "billed": [                  -   {                          -   "type": "Comisiones de pagos recibidos",                              -   "amount": 1000,                              -   "taxes": 190,                              -   "balance": 1200                                           }                               ]                   },      -   "detail": {          -   "payment": [                  -   {                          -   "trxId": 100,                              -   "date": "2020-12-01 23:01:56",                              -   "concept": "1 unidad de producto A",                              -   "paymentMethod": "Webpay",                              -   "amount": 2000,                              -   "rate": 4.19,                              -   "commission": 83.8,                              -   "taxes": 15.9,                              -   "balance": 1900.3                                           }                               ],              -   "debit": [                  -   {                          -   "id": 100,                              -   "date": "2020-12-01 23:01:56",                              -   "concept": "Reembolso",                              -   "trxId": 123,                              -   "amount": 2000,                              -   "commission": 4.19,                              -   "taxes": 190,                              -   "balance": 83.8                                           }                               ],              -   "credit": [                  -   {                          -   "id": 100,                              -   "date": "2020-12-01 23:01:56",                              -   "concept": "Reembolso",                              -   "trxId": 123,                              -   "amount": 2000,                              -   "commission": 4.19,                              -   "taxes": 190,                              -   "balance": 83.8                                           }                               ]                   }       }`

# [](#tag/merchant)merchant

Permite gestionar los comercios asociados

## [](#tag/merchant/paths/~1merchant~1create/post)Crea un comercio asociado

Este método permite crear un nuevo comercio asociado en **Flow**

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

id

required

string

Id de comercio asociado

name

required

string

Nombre de comercio asociado

url

required

string

Url del comercio asociado

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

Objeto con información del comercio asocioado en Flow

**400**

Error del Api

**401**

Error de negocio

post/merchant/create

Production server (uses live data)

https://www.flow.cl/api/merchant/create

Sandbox server (uses test data)

https://sandbox.flow.cl/api/merchant/create

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "id": "NEG-A",      -   "name": "Negocio A",      -   "url": "[https://flow.cl](https://flow.cl)",      -   "createdate": "02-04-2020 11:52",      -   "status": "0",      -   "verifydate": "02-04-2020 11:52"       }`

## [](#tag/merchant/paths/~1merchant~1edit/post)Edita un comercio asociado

Este método permite modificar un comercio asociado previamente creado en **Flow**

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

id

required

string

Id de comercio asociado

name

required

string

Nombre de comercio asociado

url

required

string

Url del comercio asociado

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

Objeto con información del comercio asociado en Flow

**400**

Error del Api

**401**

Error de negocio

post/merchant/edit

Production server (uses live data)

https://www.flow.cl/api/merchant/edit

Sandbox server (uses test data)

https://sandbox.flow.cl/api/merchant/edit

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "id": "NEG-A",      -   "name": "Negocio A",      -   "url": "[https://flow.cl](https://flow.cl)",      -   "createdate": "02-04-2020 11:52",      -   "status": "0",      -   "verifydate": "02-04-2020 11:52"       }`

## [](#tag/merchant/paths/~1merchant~1delete/post)Elimina un comercio asociado

Este método permite eliminar un comercio asociado previamente creado en **Flow**

##### Request Body schema: application/x-www-form-urlencoded

apiKey

required

string

apiKey del comercio

id

required

string

Id de comercio asociado

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

Objeto con información de la orden generada en Flow

**400**

Error del Api

**401**

Error de negocio

post/merchant/delete

Production server (uses live data)

https://www.flow.cl/api/merchant/delete

Sandbox server (uses test data)

https://sandbox.flow.cl/api/merchant/delete

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "status": "ok",      -   "message": "Merchant X deleted"       }`

## [](#tag/merchant/paths/~1merchant~1get/get)Obtener comercio asociado

Este método permite obtener la información de un comercio asociado previamente creado en **Flow**

##### query Parameters

apiKey

required

string

apiKey del comercio

id

required

string

Id de comercio asociado

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

Objeto con información del comercio asocioado en Flow

**400**

Error del Api

**401**

Error de negocio

get/merchant/get

Production server (uses live data)

https://www.flow.cl/api/merchant/get

Sandbox server (uses test data)

https://sandbox.flow.cl/api/merchant/get

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "id": "NEG-A",      -   "name": "Negocio A",      -   "url": "[https://flow.cl](https://flow.cl)",      -   "createdate": "02-04-2020 11:52",      -   "status": "0",      -   "verifydate": "02-04-2020 11:52"       }`

## [](#tag/merchant/paths/~1merchant~1list/get)Lista de comercios asociados

Permite obtener la lista de comercios paginada de acuerdo a los parámetros de paginación. Además, se puede definir los siguientes filtros:

- filter: filtro por nombre del comercio asociado
- status: filtro por estado del comercio asociado

##### query Parameters

apiKey

required

string

apiKey del comercio

start

integer

Número de registro de inicio de la página. Si se omite el valor por omisión es 0.

limit

integer

Número de registros por página. Si se omite el valor por omisón es 10. El valor máximo es de 100 registros por página.

filter

string

Filtro por nombre del comercio asociado

status

integer

Filtro por estado del comercio asociado. Valores posibles:

0: Pendiente de aprobación

1: Aprobado

2: Rechazado

s

required

string

la firma de los parámetros efectuada con su secretKey

### Responses

**200**

Objeto con información del comercio asocioado en Flow

**400**

Error del Api

**401**

Error de negocio

get/merchant/list

Production server (uses live data)

https://www.flow.cl/api/merchant/list

Sandbox server (uses test data)

https://sandbox.flow.cl/api/merchant/list

### Response samples

- 200
- 400
- 401

Content type

application/json

Copy

`{  -   "total": 200,      -   "hasMore": 1,      -   "data": "[{item list 1}{item list 2}{item list n..}"       }`

import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { XMLHttpRequestInstrumentation } from "@opentelemetry/instrumentation-xml-http-request";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { Resource } from "@opentelemetry/resources";

// Se crea una función
export const createTrace = () => {
  // Paso 6
  // Se crean la opción del collector y le pasa la config al OTLPTraceExporter.
  const collectorOptions = {
    url: "https://otlp.occdev.com.mx/v1/traces", // url is optional and can be omitted - default is http://localhost:4318/v1/traces
    headers: {}, // an optional object containing custom headers to be sent with each request
    concurrencyLimit: 10, // an optional limit on pending requests
  };

  // Paso 5
  // Para identificar las trazas en Grafana debemos agregar un nombre de servicio
  // Se importa resources (Resource) y semantic-conventions (SemanticResourceAttributes)
  // Se crea algo llamado recurso, entiendo hace la descripción de la entidad (el proveedor de trazas) para la que se está recopilando trazas y le dice que va a tener un attributo SERVICE_NAME con el nombre pokemon-service-name
  // Se pasa el resource al WebTracerProvider
  const resource = new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "pokemon-service-name",
  });

  // Paso 1
  // Primero comenzamos importando sdk-trace-web, este nos proporciona clase llamada WebTracerProvider, este módulo nos proporciona instrumentación automática en una aplicación web.
  // (Instrumentación: bibliotecas que nos permiten recopilar los datos).
  const provider = new WebTracerProvider({ resource });

  // Paso 3
  // Importamos sdk-trace-base (ConsoleSpanExporter y SimpleSpanProcessor)
  // A partir del provider usamos el metodo addSpanProcessor esto para procesar cada span generado a un formato para el exportador
  // Se crea un exportador, en este caso hacia la consola.
  provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

  // Paso 7
  // Se crea un nuevo exportador, en este caso exporter-trace-otlp-http (OTLPTraceExporter) y BatchSpanProcessor de sdk-trace-base
  // Se agrega un nuevo addSpanProcessor, pero con BatchSpanProcessor(procesador de spans de operaciones asyncronas, exporta lotes) y se usa el exporter OTLPTraceExporter

  provider.addSpanProcessor(
    new BatchSpanProcessor(new OTLPTraceExporter(collectorOptions), {
      // The maximum queue size. After the size is reached spans are dropped.
      maxQueueSize: 30,
      // The maximum batch size of every export. It must be smaller or equal to maxQueueSize.
      maxExportBatchSize: 10,
      // The interval between two consecutive exports
      scheduledDelayMillis: 500,
      // How long the export can run before it is cancelled
      exportTimeoutMillis: 30000,
    })
  );

  // Paso 4
  // Se utiliza provider.register() Para registrar el provedor de las trazas y usarse con la api de Opentelemtry
  provider.register();

  // Paso 2
  // Se importa instrumentación (registerInstrumentations) y instrumentation-xml-http-request (XMLHttpRequestInstrumentation)
  // Ahora tenemos que registrar que tipo de instrumentación queremos, en este caso la de XMLHttpRequestInstrumentation (XMLHttpRequest objeto para solicitar datos de un servidor).
  registerInstrumentations({
    instrumentations: [
      new XMLHttpRequestInstrumentation({
        applyCustomAttributesOnSpan(span, xhr) {
          if (xhr.status === 200) {
            span.setAttribute("custom", "Es un test");
          }
        },
      }),
    ],
  });
};

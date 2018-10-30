
export default {
  methods: {
    validateOpenApi(propName, value, schema, properties, definitions, errors) {
      if (schema.type === 'object') {
        if (schema.required) {
          const hasRequiredProps = schema.required.every(prop => {
            if (!value[prop]) {
              errors.push({name: 'Schema error', at: propName, detail: 'should have required property `' + prop + '`'})
            }
          })
        }
      }
    }
  }
}
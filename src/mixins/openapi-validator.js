
export default {
  methods: {
    validateProperty(prop, value, schema, definitions, errors) {
      if (typeof schema === 'string') {
        if (schema === 'boolean') {
          if (typeof value !== 'boolean') {
            errors.push({name: 'Schema error', at: prop, detail: 'should be a boolean'})
          }
        }
        else if (schema === 'number') {
          if (typeof value !== 'number') {
            errors.push({name: 'Schema error', at: prop, detail: 'should be a number'})
          }
        }
        else if (schema === 'string') {
          if (typeof value !== 'string') {
            errors.push({name: 'Schema error', at: prop, detail: 'should be a string'})
          }
        }
        else if (schema === 'array') {
          if (!Array.isArray(value)) {
            errors.push({name: 'Schema error', at: prop, detail: 'should be an array'})
          }
        }
        else if (schema === 'object') {
          if (typeof value !== 'object' || !Object.prototype.toString.call(value).match(/^(\[object (Object)\])$/)) {
            errors.push({name: 'Schema error', at: prop, detail: 'should be an object'})
          }
        }
        else if (schema === 'schema') {
          const self = this
          self.validateProperty(prop, value, definitions.schema, errors)
        }
      }
      else if (typeof schema === 'object' && Object.prototype.toString.call(schema).match(/^(\[object (Object)\])$/)) {
        if (schema.type === 'boolean') {
          if (typeof value !== 'boolean') {
            errors.push({name: 'Schema error', at: prop, detail: 'should be a boolean'})
          }
        }
        else if (schema.type === 'number') {
          if (typeof value !== 'number') {
            errors.push({name: 'Schema error', at: prop, detail: 'should be a number'})
          }
        }
        else if (schema.type === 'string') {
          if (typeof value !== 'string') {
            errors.push({name: 'Schema error', at: prop, detail: 'should be a string'})
            return
          }
          if (schema.pattern) {
            if (typeof schema.pattern === 'string') {
              const matched = value.match(RegExp(schema.pattern))
              if (!matched) {
                errors.push({name: 'Schema error', at: prop, detail: 'should match expected pattern', expectedPattern: schema.pattern})
              }
            }
            else if (Array.isArray(schema.pattern)) {
              const matched = value.match(RegExp(schema.pattern[0], schema.pattern[1]))
              if (!matched) {
                errors.push({name: 'Schema error', at: prop, detail: 'should match expected pattern', expectedPattern: schema.pattern})
              }
            }
          }
          else if (schema.enum) {
            const hasEnum = schema.enum.some(em => value === em)
            if (!hasEnum) {
              errors.push({name: 'Schema error', at: prop, detail: 'should be equal to one of the allowed values', allowedValues: schema.enum})
            }
          }
        }
        else if (schema.type === 'array') {
          if (!Array.isArray(value)) {
            errors.push({name: 'Schema error', at: prop, detail: 'should be an array'})
            return
          }
          if (schema.minItems) {
            if (value.length < schema.minItems) {
              errors.push({name: 'Schema error', at: prop, detail: 'should contain a minimum of ' + schema.minItems + ' items'})
              return
            }
          }
          if (schema.maxItems) {
            if (value.length > schema.minItems) {
              errors.push({name: 'Schema error', at: prop, detail: 'should contain a maximum of ' + schema.minItems + ' items'})
              return
            }
          }

          const self = this
          value.forEach((v, index) => {
            self.validateProperty((prop + '[' + index + ']'), v, schema.of, definitions, errors)
          })

          if (schema.uniqueItems && (schema.of === 'number' || schema.of === 'string')) {
            const u = {}
            const hasUnique = value.every(v => {
              const vk = v.toString()
              if (u[vk]) {
                return false
              }
              else {
                u[vk] = true
              }
            })
            if (!hasUnique) {
              errors.push({name: 'Schema error', at: prop, detail: 'should contain unique items'})
            }
          }
        }
        else if (schema.type === 'object') {
          if (typeof value !== 'object' || !Object.prototype.toString.call(value).match(/^(\[object (Object)\])$/)) {
            errors.push({name: 'Schema error', at: prop, detail: 'should be an object'})
          }
          if (schema.required) {
            schema.required.forEach(req => {
              if (!value[req]) {
                errors.push({name: 'Schema error', at: prop, detail: 'should have required property `' + req + '`'})
              }
            })
          }
          else if (schema.anyOf) {
            const hasAnyOf = schema.anyOf.some(p => typeof value[p] !== 'undefined')
            if (!hasAnyOf) {
              errors.push({name: 'Schema error', at: prop, detail: 'should have any of the allowed properties', anyOf: schema.anyOf})
            }
          }

          if (schema.properties && !schema.patternProperties) {

          }
          else if (schema.properties && schema.patternProperties) {

          }
          else if (!schema.properties && schema.patternProperties) {

          }
        }
      }
    }
  }
}

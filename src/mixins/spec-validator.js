
export default {
  methods: {
    validateProperty(prop, value, schema, schemaObject, errors) {
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
          this.validateProperty(prop, value, schemaObject, schemaObject, errors)
        }
      }
      else if (typeof schema === 'object' && Array.isArray(schema) && schema.some(s => (s === 'boolean' || s === 'string' || s === 'object' || s === 'schema'))) {
        if (typeof value === 'boolean' && !schema.some(s => s === 'boolean')) {
          errors.push({name: 'Schema error', at: prop, detail: 'should be one of the allowed types', allowedTypes: schema})
        }
        else if (typeof value === 'string' && !schema.some(s => s === 'string')) {
          errors.push({name: 'Schema error', at: prop, detail: 'should be one of the allowed types', allowedTypes: schema})
        }
        else if (typeof value === 'object' && Object.prototype.toString.call(value).match(/^(\[object (Object)\])$/) && !schema.some(s => s === 'object')) {
          errors.push({name: 'Schema error', at: prop, detail: 'should be one of the allowed types', allowedTypes: schema})
        }
        else if (typeof value === 'object' && Object.prototype.toString.call(value).match(/^(\[object (Object)\])$/) && !schema.some(s => s === 'schema')) {
          errors.push({name: 'Schema error', at: prop, detail: 'should be one of the allowed types', allowedTypes: schema})
        }

        if (schema.some(s => s === 'schema') && typeof value === 'object' && Object.prototype.toString.call(value).match(/^(\[object (Object)\])$/)) {
          this.validateProperty(prop, value, schemaObject, schemaObject, errors)
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
            self.validateProperty((prop + '[' + index + ']'), v, schema.of, schemaObject, errors)
          })

          if (schema.uniqueItems) {
            const unique = {}
            const q = {}
            if (typeof schema.uniqueItems === 'boolean') {
              q.hasUnique = value.every(item => {
                const v = item.toString()
                if (unique[v]) {
                  return false
                }
                else {
                  unique[v] = true
                  return true
                }
              })
            }
            else if (Array.isArray(schema.uniqueItems)) {
              q.hasUnique = value.every(item => {
                const v = schema.uniqueItems.map(uk => item[uk].toString()).join('')
                if (unique[v]) {
                  return false
                }
                else {
                  unique[v] = true
                  return true
                }
              })
            }
            if (!q.hasUnique) {
              errors.push({name: 'Schema error', at: prop, detail: 'should contain unique items'})
            }
          }
        }
        else if (schema.type === 'object') {
          if (typeof value !== 'object' || !Object.prototype.toString.call(value).match(/^(\[object (Object)\])$/)) {
            errors.push({name: 'Schema error', at: prop, detail: 'should be an object'})
          }
          if (schema.required) {
            if (Array.isArray(schema.required)) {
              schema.required.forEach(req => {
                if (!value[req]) {
                  errors.push({name: 'Schema error', at: prop, detail: 'should have required property `' + req + '`'})
                }
              })
            }
            else if (typeof schema.required === 'object' && Object.prototype.toString.call(schema.required).match(/^(\[object (Object)\])$/)) {
              if (schema.required.anyOf) {
                const hasAnyOf = schema.required.anyOf.some(p => typeof value[p] !== 'undefined')
                if (!hasAnyOf) {
                  errors.push({name: 'Schema error', at: prop, detail: 'should have at least one of the required properties', anyOfRequired: schema.required.anyOf})
                }
              }
              if (schema.required.pattern) {
                if (typeof schema.required.pattern === 'string') {
                  const hasPattern = Object.keys(value).some(p => p.match(RegExp(schema.required.pattern)))
                  if (!hasPattern) {
                    errors.push({name: 'Schema error', at: prop, detail: 'should have required property with expected pattern', pattern: schema.required.pattern})
                  }
                }
                else if (Array.isArray(schema.required.pattern)) {
                  const hasPattern = Object.keys(value).some(p => p.match(RegExp(schema.required.pattern[0], schema.required.pattern[1])))
                  if (!hasPattern) {
                    errors.push({name: 'Schema error', at: prop, detail: 'should have required property with expected pattern', pattern: schema.required.pattern})
                  }
                }
              }
            }
          }

          if (schema.properties) {
            const self = this
            Object.keys(schema.properties).forEach(p => {
              if (value[p]) {
                self.validateProperty((prop + '.' + p), value[p], schema.properties[p], schemaObject, errors)
              }
            })
          }

          if (schema.patternProperties) {
            const self = this
            Object.keys(schema.patternProperties).forEach(px => {
              Object.keys(value).forEach(p => {
                if (p.match(RegExp(px))) {
                  self.validateProperty((prop + '.' + p), value[p], schema.patternProperties[px], schemaObject, errors)
                }
              })
            })
          }
        }
      }
    }
  }
}


const chai = require('chai')
const sinon = require('sinon')

chai.config.includeStack = true
chai.use(require('chai-as-promised'))
chai.use(require('dirty-chai'))
chai.use(require('sinon-chai'))

global.expect = chai.expect
global.sinon = sinon
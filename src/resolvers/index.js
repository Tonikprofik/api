const Query = require('./query');
const Mutation = require('./mutation');
const {GraqhQLDateTime} = require('graphql-iso-date');

module.exports = {
    Query, Mutation, DateTime: GraqhQLDateTime
};
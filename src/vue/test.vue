<script>
'use strict';
// const log = require('../misc/ConsoleLog');

module.exports = {
  data(){
    return {
      foo: 'abc'
      ,bar: true
    };
  }

  ,computed: {
    _foo(){ return this.foo + ' computed'; }
  }

};

</script>

<template><span>
  <h3>foo: {{ foo }}</h3>
  <h3>_foo: {{ _foo }}</h3>
  <p>bar: {{ bar }}</p>
	<!-- <p>Vue test component</p> -->
</span></template>

<style scoped>
	
</style>

<script>

module.exports = {
   name: 'on-off-icon'
   ,props: ['condition']
};

</script>

<template>
<!-- <span :class="['glyphicon', condition ? 'glyphicon-asterisk' : 'glyphicon glyphicon-minus']"></span>    -->
<i :class="['fa', condition ? 'fa-toggle-on' : 'fa-toggle-off']" aria-hidden="true"></i>
</template>

<style scoped="">
  /*.fa {
    font-size: 200%;
  }*/
</style>

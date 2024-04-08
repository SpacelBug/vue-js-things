<template>
  <div class="main-box">

    <div class="component-box">
      <div class="component-box-component">
        <h3>Select</h3>
        <vue-select
            v-model="testValueSelect"
            :options="options"
            style="width: 200px; color: black"
        />
      </div>
      <div class="component-box-description">
        Компонент заменяющий собой стандартный select
        <pre>
          props:
            required:
              modelValue - отвечает за v-model (строка)
              options - параметры для выбора
            optional:
              placeholder - default = 'Select value'
              backgroundColor - default = 'grey'
              activeColor - default = 'lightgrey'
              border - default = 'none'
              boxShadow - default = 'none'
              optionsBoxHeight - default = '280'
        </pre>
      </div>
    </div>

    <div class="component-box">
      <div class="component-box-component">
        <h3>MultiSelect</h3>
        <multi-select
            v-model="testValueMultiSelect"
            :options="options"
            style="width: 200px; color: black"
        />
      </div>
      <div class="component-box-description">
        Select с возможностью выбора нескольких значений
        <pre>
          props:
            required:
              modelValue - отвечает за v-model (список)
              options - параметры для выбора
            optional:
              placeholder - default = 'Select value'
              backgroundColor - default = 'grey'
              activeColor - default = 'lightgrey'
              border - default = 'none'
              boxShadow - default = 'none'
              optionsBoxHeight - default = '280'
        </pre>
      </div>
    </div>

  </div>
</template>

<script>
import VueSelect from "@/components/basic/select/VueSelect";
import MultiSelect from "@/components/basic/multi-select/MultiSelect";

export default {
  name: "ComponentsView",
  components: {
    VueSelect,
    MultiSelect,
  },
  data() { return {
    testValueSelect: null,
    options: [...Array(25).keys().map((index)=>{return `Some value ${index}`})],
    testValueMultiSelect: null,
  }}
}
</script>

<style scoped>
.main-box{
  padding: 32px;
}
.component-box{
  display: flex;
  flex-direction: row;
  gap: 32px;
  padding: 16px;
}
</style>
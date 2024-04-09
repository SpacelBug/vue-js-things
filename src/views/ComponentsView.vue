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

    <div class="component-box">
      <div class="component-box-component">
        <h3>MultiSelect</h3>
        <date-input style="color: black"/>
      </div>
      <div class="component-box-description">
        Компонент выбора даты
        <pre>
          props:
            required:
              modelValue - отвечает за v-model (Date)
            optional:
              mainColor - главный цвет (String)
              backgroundColor - цвет фона (String)
              additionalColor - дополнительный цвет (String)
              activeColor - цвет активных элементов (String)

              inputType - может принимать значения date, datetime и time (String)
              accuracy - точность даты. принимает значения [year, month, day, hour, min, sec] (String)
              isShowInputsPanel - логическая переменная отвечающая за отображения панели ввода даты с клавиатуры (Boolean)
        </pre>
      </div>
    </div>

    <div class="component-box">
      <div class="component-box-component">
        <h3>MultiUploader</h3>
        <multi-uploader style="color: black" :type="'images'"/>
      </div>
      <div class="component-box-description">
        Компонент загрузки файлов
        <pre>
          props:
            important:
              type - строка определяющая тип файлов. Может принимать значения images, files (String)
            optional:
              border -
              backgroundColor -
              additionalColor -
        </pre>
      </div>
    </div>

    <div class="component-box">
      <div class="component-box-component">
        <h3>Uploader</h3>
        <vue-uploader style="color: black" :type="'images'"/>
      </div>
    </div>

  </div>
</template>

<script>
import VueSelect from "@/components/basic/select/VueSelect";
import MultiSelect from "@/components/basic/multi-select/MultiSelect";
import DateInput from "@/components/basic/calendar/DateInput";
import MultiUploader from "@/components/basic/multi-uploader/MultiUploader";
import VueUploader from "@/components/basic/uploader/VueUploader";

export default {
  name: "ComponentsView",
  components: {
    VueSelect,
    MultiSelect,
    DateInput,
    MultiUploader,
    VueUploader,
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
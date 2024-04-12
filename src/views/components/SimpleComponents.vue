<template>
  <div class="components-list">
    <div class="component-name" @click="showingComponentName = 'Select'">Select</div>
    <div class="component-name" @click="showingComponentName = 'MultiSelect'">MultiSelect</div>
    <div class="component-name" @click="showingComponentName = 'DatetimeInput'">DatetimeInput</div>
    <div class="component-name" @click="showingComponentName = 'MultiUploader'">MultiUploader</div>
    <div class="component-name" @click="showingComponentName = 'Uploader'">Uploader</div>
    <div class="component-name" @click="showingComponentName = 'EditableList'">EditableList</div>
    <div class="component-name" @click="showingComponentName = 'FilteredSelect'">FilteredSelect</div>
    <div class="component-name" @click="showingComponentName = 'EditableTable'">EditableTable</div>
  </div>

  <div class="main-box">

    <div class="component-box" v-if="showingComponentName === 'Select'">
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

    <div class="component-box" v-if="showingComponentName === 'MultiSelect'">
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

    <div class="component-box" v-if="showingComponentName === 'DatetimeInput'">
      <div class="component-box-component">
        <h3>Datetime input</h3>
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

    <div class="component-box" v-if="showingComponentName === 'MultiUploader'">
      <div class="component-box-component">
        <h3>MultiUploader</h3>
        <multi-uploader style="color: black" :type="'images'"/>
      </div>
      <div class="component-box-description">
        Компонент загрузки нескольких файлов
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

    <div class="component-box" v-if="showingComponentName === 'Uploader'">
      <div class="component-box-component">
        <h3>Uploader</h3>
        <vue-uploader style="color: white;"/>
      </div>
      <div class="component-box-description">
        Компонент загрузки файла
        <pre>
          props:
        </pre>
      </div>
    </div>

    <div class="component-box" v-if="showingComponentName === 'EditableList'">
      <div class="component-box-component">
        <h3>Editable List</h3>
        <editable-list v-model="testList" style="color: white;"/>
      </div>
    </div>

    <div class="component-box" v-if="showingComponentName === 'FilteredSelect'">
      <div class="component-box-component">
        <h3>Filtered Select</h3>
        <filtered-select v-model="testValueSelect" :options="options"/>
      </div>
      <div class="component-box-description">
        Выпадающий список с поиском значений
        <pre>some row
          props:
        </pre>
      </div>
    </div>

    <div class="component-box" v-if="showingComponentName === 'EditableTable'">
      <div class="component-box-component">
        <h3>Editable Table</h3>
        <editable-table :headers="tableHeader" :rows="tableData"/>
      </div>
    </div>

  </div>
</template>

<script>
import VueSelect from "@/components/basic/select/VueSelect";
import MultiSelect from "@/components/basic/multi-select/MultiSelect";
import DateInput from "@/components/basic/datetime-input/DateInput";
import MultiUploader from "@/components/basic/multi-uploader/MultiUploader";
import VueUploader from "@/components/basic/uploader/VueUploader";
import EditableList from "@/components/basic/editable-list/EditableList";
import FilteredSelect from "@/components/basic/filtered-select/FilteredSelect";
import EditableTable from "@/components/basic/editable-table/EditableTable";

export default {
  name: "ComponentsView",
  components: {
    VueSelect,
    MultiSelect,
    DateInput,
    MultiUploader,
    VueUploader,
    EditableList,
    FilteredSelect,
    EditableTable,
  },
  data() { return {
    testValueSelect: null,
    testList: [],
    options: [...Array(25).keys().map((index)=>{return `Some value ${index}`})],
    testValueMultiSelect: null,
    showingComponentName: null,

    tableHeader: {
      name: {caption: 'Название', inputType: 'text', required: false},
      tags: {caption: 'Теги', inputType: 'text', required: false},
      person: {caption: 'Пользователь', inputType: 'text', required: false, subHeaders: {
          personName: {caption: 'Имя', inputType: 'text'},
          personAge: {caption: 'Возраст', inputType: 'number'},
      }},
    },
    tableData: [
      {name: 'some row', tags: ['art', 'simple', 'cartoon'], person: {personName: 'dragon', personAge: 100}},
      {name: 'some row', tags: ['art', 'simple', 'cartoon'], person: {personName: 'dragon', personAge: 100}},
      {name: 'some row', tags: ['art', 'simple', 'cartoon'], person: {personName: 'dragon', personAge: 100}},
      {name: 'some row', tags: ['art', 'simple', 'cartoon'], person: {personName: 'dragon', personAge: 100}},
      {name: 'some row', tags: ['art', 'simple', 'cartoon'], person: {personName: 'dragon', personAge: 100}},
    ],
  }}
}
</script>

<style scoped>
a{
  color: white;
  text-decoration: none;
}
.components-list{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
  padding: 32px;
}
.component-name{
  user-select: none;
  cursor: pointer;
}
.main-box{
  padding: 32px;
}
.component-box{
  display: flex;
  flex-direction: row;
  gap: 32px;
  padding: 16px;
}
.component-box-component{
  width: 100%;
}
</style>
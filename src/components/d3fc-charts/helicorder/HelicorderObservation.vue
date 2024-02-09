<template>
  <svg class="observation-svg" v-if="polygons">
    <polygon v-for="polygon in polygons"
             :class="['observation', {'unsaved-observation': !isSaved, 'observation-stroke': isHover}]"
             :points="polygon.join(',')"
             :style="`fill: ${color}; pointer-events: ${pointerEvents};`"
             @click="$emit('observationClick')"
             @contextmenu="$emit('observationContext')"
             @mouseenter="$emit('observationEnter'); isHover = true"
             @mouseleave="$emit('observationLeave'); isHover = false"/>
  </svg>
</template>

<script>
export default {
  name: "HelicorderObservation",
  props: {
    lineHeight: Number,
    width: Number,
    defaultColor: String,
    pointerEvents: String,

    height: Number,
    leftStart: Number,
    leftEnd: Number,
    isSaved: Boolean,
    color: String,
  },
  data() { return {
    isHover: false,
  }},
  computed: {
    polygons() {
      let polygons = []

      if (this.height === this.lineHeight) {
        //rect
        polygons.push([
          `${this.leftStart} 0`,

          `${this.leftEnd} 0`,

          `${this.leftEnd} ${this.height}`,

          `${this.leftStart} ${this.height}`,
        ])
      } else if ((this.leftEnd <= this.leftStart) && (this.height === (this.lineHeight * 2))) {
        //two rects
        polygons.push([
          `${this.leftStart} 0`,

          `${this.width} 0`,

          `${this.width} ${this.lineHeight}`,

          `${this.leftStart} ${this.lineHeight}`,
        ])

        polygons.push([
          `0 ${this.lineHeight}`,

          `${this.leftEnd} ${this.lineHeight}`,

          `${this.leftEnd} ${this.height}`,

          `0 ${this.height}`,
        ])
      }
      else {
        // octagon
        polygons.push([
          `0 ${this.lineHeight}`,
          `${this.leftStart} ${this.lineHeight}`,
          `${this.leftStart} 0`,

          `${this.width} 0`,

          `${this.width} ${this.height - this.lineHeight}`,
          `${this.leftEnd} ${this.height - this.lineHeight}`,
          `${this.leftEnd} ${this.height}`,

          `0 ${this.height}`,
        ])
      }

      return polygons
    }
  }
}
</script>

<style scoped>
.observation-svg{
  pointer-events: none;
  top: 0;
  position: absolute;
  width: 100%;
  height: 100%;
}
.observation{
  pointer-events: v-bind(observationPointerEvents);
  position: absolute;
  width: 100%;
  fill: v-bind(defaultColor);
}
.unsaved-observation{
  stroke-width: 2px;
  stroke: #ad1010;
}
.observation:after{
  content: '';
  position: absolute;
  clip-path: inherit;
  height: inherit;
  width: 100%;
}
.observation-stroke{
  stroke: black;
  stroke-width: 2px;
}
</style>
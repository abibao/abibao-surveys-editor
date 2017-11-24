/* global FileReader */

import Debug from 'debug'
import Dropzone from 'vue-fineuploader/dropzone'

import getMedia from './methods/getMedia'
import logout from './methods/logout'

export default {
  name: 'ui-media',
  components: {
    'v-uploader': Dropzone
  },
  data: function () {
    return {
      initialized: false,
      user: false,
      uploader: {
        methods: {
          addFiles: (files) => {
            const reader = new FileReader()
            reader.readAsDataURL(files[0])
            reader.addEventListener('load', () => {
              this.$feathers.service('uploads')
                .create({uri: reader.result})
                .then(() => {
                  this.getMedia()
                }).catch((error) => {
                  console.error(error)
                })
            }, false)
          }
        }
      },
      data: {
        media: { total: 0, dataProvider: [] }
      }
    }
  },
  beforeMount: function () {
    this.debug('beforeMount')
  },
  mounted: function () {
    this.debug('mounted')
    this.user = this.$route.meta.user
    this.getMedia()
    this.initialized = true
  },
  updated: function () {
    this.debug('updated')
  },
  destroyed: function () {
    this.debug('destroyed')
  },
  methods: {
    debug: Debug('abibao:platform:ui-media'),
    getMedia,
    logout
  }
}

<template>
  <el-container style="width: 100%;height: 100%;">
    <el-aside style="width: 200px;">
      <!-- <div class="item-common" style="background: #545c64;">
        <el-input
          class="filter-bucket"
          size="mini"
          v-model="filter"
          prefix-icon="el-icon-search"
          placeholder="搜索">
        </el-input>
        <el-button
          plain
          class="add-bucket"
          icon="el-icon-plus"
          size="mini">
        </el-button>
      </div> -->
      <el-menu
        :default-active="active"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        style="height: calc(100% - 48px);overflow-y: auto">
        <el-menu-item
          class="bucket-item"
          v-for="(item, index) in buckets"
          :key="index"
          :index="index.toString()"
          @click="e => $noRepeat(selectBucket, e, item)">
          <span slot="title">{{ item.name }}</span>
          <el-button @click.stop="() => delBucket(item.name)" type="text" size="small" class="del-bucket" icon="el-icon-circle-close"></el-button>
        </el-menu-item>
        <div class="item-common" style="background: #545c64;border: none;">
          <el-button
            @click="addBucket"
            round
            type="info"
            size="mini"
            icon="el-icon-plus"
            style="font-weight: 200;padding: 7px;background: #545c64;">
          </el-button>
          <v-add-bucket
            :visible="addBktVisible"
            @close="addBktVisible = false"
            @success="handleAddSuccess"></v-add-bucket>
        </div>
      </el-menu>
      <div class="item-common"
        style="background: #545c64;">
        <i class="client-menu iconfont icon-menu" @click="handleSetting"></i>
      </div>
    </el-aside>

    <keep-alive>
      <component
        v-if="view !== 'VSetting'"
        :loading="loading"
        :is="view"
        :bucket="bucket"
        :domains="domains"
        :zone="zone"
        :refresh="needRefresh"
        @change="handleViewChange"
        @create="addBucket"></component>
      <v-setting v-else @back="() => handleViewChange({ view: 'VContent' })"></v-setting>
    </keep-alive>
  </el-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import VAddBucket from './components/AddBucket'
import VContent from './Content'
import VUpload from './Upload'
import VSetting from './Setting'

export default {
  data () {
    return {
      loading: true, // 加载信号
      needRefresh: false, // 资源列表刷新标志
      view: 'VContent', // 组件名
      filter: '', // bucket筛选关键字
      bucket: '', // 当前选中bucket名称
      domains: [], // 当前选中bucket域名
      zone: '', // 当前选中bucket的存储区域
      addBktVisible: false
    }
  },
  computed: {
    ...mapGetters({
      _buckets: 'buckets'
    }),
    buckets () {
      return this._buckets.filter(item => {
        return this.filter === '' || item['name'].indexOf(this.filter) !== -1
      })
    },
    active () {
      return this.buckets.reduce((acc, cur, index) => {
        if (acc === null) {
          acc = cur['name'] === this.bucket ? index.toString() : acc
        }
        return acc
      }, null) || ''
    }
  },
  beforeMount () {
    this.fetchBuckets()
  },
  methods: {
    ...mapActions({
      _fetchBuckets: 'FETCH_BUCKETS',
      _createBucket: 'CREATE_BUCKET',
      _deleteBucket: 'DELETE_BUCKET',
      _fetchList: 'FETCH_LIST',
      _fetchBucketDomain: 'FETCH_BUCKET_DOMAIN',
      _fetchBucketZone: 'FETCH_BUCKET_ZONE'
    }),
    setLoading (loading = false, time = 2000) {
      setTimeout(() => {
        this.$nextTick(() => {
          this.loading = loading
        })
      }, loading ? 0 : time)
    },
    handleViewChange (v = {}) {
      const { view = 'VContent', refresh = false } = v
      this.needRefresh = refresh
      this.view = view
    },
    handleSetting () {
      this.handleViewChange({ view: 'VSetting' })
    },
    defaultClick (bucket) {
      this.$nextTick(() => {
        let _index = this.buckets.reduce((acc, cur, index) => {
          if (acc === null) {
            acc = cur['name'] === bucket ? index : acc
          }
          return acc
        }, null)
        if (_index === null) {
          _index = this.buckets[0] ? 0 : null
        }
        if (_index !== null) {
          this.$nextTick(() => {
            document.querySelectorAll('.bucket-item')[_index].click()
          })
        } else {
          this.bucket = ''
        }
      })
    },
    async fetchBuckets () {
      this.setLoading(true)
      try {
        await this._fetchBuckets({})
        this.defaultClick(this.bucket)
      } catch (e) {
        console.warn(e)
      } finally {
        await this.setLoading(false, 2000)
      }
    },
    async selectBucket (bucketObj) {
      this.setLoading(true)
      this.view = 'VContent'
      this.needRefresh = false
      this.domains = bucketObj['domains'] || []
      this.zone = bucketObj['zone'] || ''
      try {
        // 查询存储空间区域
        if (!!this.zone === false) {
          this.zone = await this._fetchBucketZone({ bucket: bucketObj['name'] })
        }
        // 查询存储空间域名
        if (!!this.domains === false || this.domains.length === 0) {
          this.domains = await this._fetchBucketDomain({ bucket: bucketObj['name'] })
        }
        // 查询存储空间数据记录
        await this._fetchList({ bucket: bucketObj['name'] })
      } catch (e) {
        console.warn(e)
      } finally {
        this.bucket = bucketObj['name']
        await this.setLoading(false, 500)
      }
    },
    addBucket () {
      this.addBktVisible = true
    },
    async handleAddSuccess (form = {}) {
      try {
        const { bucket, region } = form
        await this._createBucket({ bucket, region })
        this.fetchBuckets()
        this.$message.success({
          message: `新增存储空间【${bucket}】成功！`,
          center: true
        })
      } catch (e) {
        console.warn(e)
      }
    },
    async delBucket (bucket) {
      try {
        await this.$showConfirm({
          title: '提示',
          content: `是否确认删除: ${bucket} ?`
        })
        await this._deleteBucket({ bucket })
        this.fetchBuckets()
        this.$message.success({
          message: `删除存储空间【${bucket}】成功！`,
          center: true
        })
      } catch (e) {
        console.warn(e)
      }
    }
  },
  components: {
    VContent,
    VUpload,
    VSetting,
    VAddBucket
  }
}
</script>

<style scoped>
.add-bucket {
    padding: 7px;
    position: absolute;
    top: 10px;
    right: 10px;
}
.bucket-item {
    padding-right: 30px;
    height: 48px;
    line-height: 48px;
}
.bucket-item .del-bucket {
    display: none;
}
.bucket-item:hover .del-bucket {
    display: inline-block;
    height: 100%;
    position: absolute;
    right: 0;
    border: none;
    color: inherit;
}
.item-common {
    display: block;
    width: 100%;
    height: 48px;
    margin: 0;
    padding: 0 20px;
    border-right: 1px solid #fff;
    line-height: 48px;
    box-sizing: border-box;
    /* background: #4b4f53; */
    background: #545c64;
    position: relative;
}
.client-menu {
    font-size: 20px;
    color: #ccc;
    cursor: pointer;
}
.client-menu:hover {
    color: #fff;
}
.table-container {
    display: block;
    width: 100%;
    height: 574px;
    margin: 0;
    padding: 0;
    position: relative;
    /* background: #ccc; */
}
</style>

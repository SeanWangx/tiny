<template>
  <div class="wrapper-container flex-container">
    <div class="login-container">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="AccessKey" prop="AccessKey" size="mini">
          <el-input v-model="form.AccessKey" placeholder="AccessKey" clearable></el-input>
        </el-form-item>
        <el-form-item label="SecretKey" prop="SecretKey" size="mini">
          <el-input v-model="form.SecretKey" placeholder="SecretKey" clearable :type="type">
            <template slot="append">
              <el-button type="text" @click="visible = !visible">{{ visible ? '隐藏' : '显示' }}</el-button>
            </template>
          </el-input>
        </el-form-item>
        <div>
          <el-button size="mini" type="primary" @click="login">Login</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Login',
  data () {
    return {
      visible: false,
      type: 'password',
      form: {
        AccessKey: '',
        SecretKey: ''
      },
      rules: {
        AccessKey: [
          { required: true, message: '请输入AccessKey', trigger: 'blur' }
        ],
        SecretKey: [
          { required: true, message: '请输入SecretKey', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters({
      userValid: 'userValid'
    })
  },
  methods: {
    ...mapActions({
      _login: 'LOGIN'
    }),
    login () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this._login({
            accessKey: this.form.AccessKey,
            secretKey: this.form.SecretKey
          }).then(() => {
            this.$router.replace('/')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  watch: {
    visible (newVal) {
      this.type = newVal ? 'text' : 'password'
    }
  }
}
</script>

<style scoped>
.login-container {
    display: block;
    width: 100%;
    height: auto;
    margin: 0;
    padding: 0 20px;
    box-sizing: border-box;
    text-align: center;
}
</style>

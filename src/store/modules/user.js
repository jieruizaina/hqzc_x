import { login, logout, getInfo ,register} from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import defAva from '@/assets/images/profile.jpg'

const useUserStore = defineStore(
  'user',
  {
    state: () => ({
      token: getToken(),
      name: localStorage.name ? localStorage.name :'',
      avatar: localStorage.avatar ? localStorage.avatar : defAva,
      roles: localStorage.roles ? localStorage.roles :[],
			userId:localStorage.userId ? localStorage.userId :'',
      isLogin:false,
      isRegister:false,
			isProvide:false,
			provideList:null,
			//注册表中的名
			fullName:''
    }),
    actions: {
      changeFullName(info){
        this.fullName = info
      },
      //登录注册弹窗
      changeLogin(info){
        this.isLogin = info
      },
      changeRegister(info){
        this.isRegister = info
      },
			//贷款弹窗
      changeProvide(info){
        this.isProvide = info
      },
			//编辑 申请某个贷款信息时使用
      changeProvideList(info){
        this.provideList = info
      },
      
      // 注册
      register(userInfo) {
				console.log('userInfo',userInfo);
        return new Promise((resolve, reject) => {
          register(userInfo).then(res => {
						console.log('res',res);
            setToken(res.data)
            this.token = res.data
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 登录
      login(userInfo) {
        // const username = userInfo.username.trim()
        // const password = userInfo.password
        // const code = userInfo.code
        // const uuid = userInfo.uuid
        return new Promise((resolve, reject) => {
          login(userInfo).then(res => {
						console.log('res',res);
            setToken(res.data.token)
            this.token = res.data
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 获取用户信息
      getInfo() {
        return new Promise((resolve, reject) => {
          getInfo().then(res => {
						console.log('res用户',res);
            const user = res.data
            const avatar = (user.avatar == "" || user.avatar == null) ? defAva :  user.avatar;

            if (user.roles && user.roles.length > 0) { // 验证返回的roles是否是一个非空数组
              localStorage.roles = user.roles
							this.roles = user.roles
            } else {
              localStorage.roles = []
              this.roles = []
            }
            localStorage.name = user.nickname
            localStorage.userId = user.id
            localStorage.avatar = avatar;
						
            this.name = user.nickname
            this.userId = user.id
            this.avatar = avatar;
						console.log('avatar',avatar);
            resolve(res)
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 退出系统
      logOut() {
        return new Promise((resolve, reject) => {
          // logout(this.token).then(() => {
          //   this.token = ''
          //   this.roles = []
          //   this.permissions = []
          //   removeToken()
          //   resolve()
          // }).catch(error => {
          //   reject(error)
          // })
					
					// this.token = ''
					// this.roles = []
					// this.permissions = []
					localStorage.clear()
					removeToken()
					resolve()
        })
      }
    }
  })

export default useUserStore

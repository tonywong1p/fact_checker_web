<template>
  <v-menu :close-on-content-click="false" :nudge-width="200" offset-x>
    <v-avatar slot="activator" class="">
      <v-btn flat icon>
        <v-icon dark>more_vert</v-icon>
      </v-btn>
    </v-avatar>
    <v-card v-if="selectedTab==0">
      <v-list>
        <v-list-tile avatar v-if="profile.username=='guest'" @click="dialog=!dialog;userMode=0">
          <v-list-tile-avatar>
            <v-icon dark v-if="profile.imageUrl==''">account_circle</v-icon>
            <img v-if="profile.imageUrl!=''" :src="profile.imageUrl"></v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>Login</v-list-tile-title>
            <v-list-tile-sub-title>Click here to login</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile avatar v-if="profile.username!='guest'" @click="dialog=!dialog;userMode=2">
          <v-list-tile-avatar>
            <v-icon dark v-if="profile.imageUrl==''">account_circle</v-icon>
            <img v-if="profile.imageUrl!=''" :src="profile.imageUrl"> </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{profile.fullname}}</v-list-tile-title>
            <v-list-tile-sub-title>{{profile.email}}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-divider></v-divider>
      <v-list>
        <v-list-tile v-if="profile.username=='guest'" @click="dialog=!dialog;userMode=1">
          <v-list-tile-action>
            <v-icon>person_add</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Register</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="selectedTab=1">
          <v-list-tile-action>
            <v-icon>language</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>{{$t('setting.language')}}</v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-if="profile.username!='guest'" @click="userLogout()">
          <v-list-tile-action>
            <v-icon>input</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>{{$t('setting.logout')}}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-card>
    <v-card v-if="selectedTab==1">
      <v-list>
        <v-list-tile>
          <v-btn small fab flat @click="selectedTab=0">
            <v-icon>arrow_back</v-icon>
          </v-btn>
        </v-list-tile>
        <v-list-tile v-for="(lang, i) in langs" :key="`Lang${i}`" @click="selectLang(lang)">
          <v-list-tile-title>{{ lang.name }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-card>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <!-- Login -->
      <v-card v-if="userMode==0">
        <v-card-title>
          <h3 class="headline mb-0">Uesr Login</h3>
          <v-spacer></v-spacer>
          <v-btn flat icon @click.native="dialog = false">
            <v-icon>clear</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form ref="loginForm" v-model="loginValid" lazy-validation>
            <v-layout wrap justify-center align-center @keyup.enter="userLogin()">
              <img style="width:100px;height:100px;" src="../assets/logo.png" />
              <h3 class="display-1 ml-3">Fact Checker</h3>
              <v-flex xs12>
                <v-text-field v-model="loginForm.username" :rules="usernameRules" label="Username" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="loginForm.password" :rules="passwordRules" label="Password" type="password" required></v-text-field>
              </v-flex>
              <span class="red--text">{{loginMessage}}</span>
              <v-btn style="width:100%" @click.native="userLogin()" :disabled="!loginValid">Login</v-btn>
            </v-layout>
          </v-form>
          <!-- <div class="my-3" style="text-align:center">OR</div>
            <g-signin-button :params="googleSignInParams" @success="onSignInSuccess">
              <v-btn style="width:100%;margin:0px">
                <img width="20px" alt="Google &quot;G&quot; Logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" />
                <span class="mx-3">Google Login</span>
              </v-btn>
            </g-signin-button> -->
        </v-card-text>
      </v-card>
      <!-- Register -->
      <v-card v-if="userMode==1">
        <v-card-title>
          <h3 class="headline mb-0">Account Register</h3>
          <v-spacer></v-spacer>
          <v-btn flat icon @click.native="dialog = false">
            <v-icon>clear</v-icon>
          </v-btn>
        </v-card-title>
        <v-container>
          <v-form ref="registerForm" v-model="registerValid" lazy-validation>
            <v-layout wrap justify-center align-center @keyup.enter="userRegister()">
              <img style="width:100px;height:100px;" src="../assets/logo.png" />
              <h3 class="display-1 ml-3">Fact Checker</h3>
              <v-flex xs12>
                <v-text-field v-model="registerForm.fullname" label="Full name" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="registerForm.username" label="Username" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="registerForm.password" label="Password" type="password" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="registerForm.email" label="Email" required></v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click.native="userRegister()" :disabled="!registerValid">Register</v-btn>
        </v-card-actions>
      </v-card>
      <!-- Edit Profile -->
      <v-card v-if="userMode==2">
        <v-card-title>
          <h3 class="headline mb-0">Your Profile</h3>
          <v-spacer></v-spacer>
          <v-btn flat icon @click.native="dialog = false">
            <v-icon>clear</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-layout wrap>
            <v-flex xs12>
              <v-layout justify-center align-center>
                <v-avatar :size="100" color="grey" class="ma-3">
                  <v-icon style="font-size:60px" dark v-if="profile.imageUrl==''">account_circle</v-icon>
                  <img v-if="profile.imageUrl!=''" :src="profile.imageUrl">
                </v-avatar>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <v-text-field disabled v-if="profile.type=='self'" v-model="profile.username" label="Username" required></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field disabled v-model="profile.fullname" label="Full Name" required></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field disabled v-model="profile.email" label="Email" required></v-text-field>
            </v-flex>
            <!-- <v-flex xs12>
                    <v-text-field v-if="profile.type=='self'" v-model="profile.password" label="Password" type="password" required></v-text-field>
                  </v-flex> -->
          </v-layout>
        </v-card-text>
        <!-- <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click.native="userLogin()">Update</v-btn>
              </v-card-actions> -->
      </v-card>
    </v-dialog>
  </v-menu>
</template>

<script>
  import vue2Dropzone from "vue2-dropzone";
  import "vue2-dropzone/dist/vue2Dropzone.min.css";
  export default {
    components: {
      vue2Dropzone: vue2Dropzone
    },
    props: {},
    data: () => ({
      selectedTab: 0,
      userMode: 0,
      loginMessage: null,
      loginForm: {
        username: null,
        password: null,
      },
      loginValid: false,
      usernameRules: [
        v => !!v || 'Username is required',
      ],
      passwordRules: [
        v => !!v || 'Password is required',
      ],
      registerForm: {
        username: '',
        password: '',
        fullname: '',
        email: '',
        imageUrl: '',
      },
      registerValid: false,
      googleSignInParams: {
        client_id: '18039521998-ghoqvs71559aae2birkrjij9s49l61v7.apps.googleusercontent.com', //http://localhost:8081
      },
      langs: [{
        name: '繁體中文',
        value: 'ch',
        moment: 'zh-cn'
      }, {
        name: 'English',
        value: 'en',
        moment: 'en-au'
      }],
      selectedLang: JSON.parse(localStorage.getItem("factchecker_language")),
      dialog: false,
      drawer: true,
      search: null,
      isAdmin: false,
      tags: [],
      color: ['blue', 'pink', 'teal', 'orange', 'purple', 'deep-purple', 'indigo', 'cyan', 'brown', 'deep-orange'],
      selectedTag: 'all',
    }),
    computed: {
      dropzoneOptions: function() {
        return ({
          paramName: "coverImage",
          thumbnailWidth: 200,
          maxFiles: 1,
          maxFilesize: 10,
          dictDefaultMessage: `<i class='material-icons' style='font-size:80px'>add_photo_alternate</i><br>${this.$t('form.dropzone')}${this.$t('form.required')}`,
          addRemoveLinks: true,
          acceptedFiles: 'image/*',
          url: this.api_url + '/upload',
        })
      },
      profile: function() {
        let profile = localStorage.getItem('factchecker_profile');
        if (profile == null) {
          return ({
            username: 'guest',
            fullname: 'Guest',
            email: 'No email',
            imageUrl: '',
          })
        } else {
          return JSON.parse(profile);
        }
      }
    },
    methods: {
      userLogin() {
        let self = this;
        let api = self.api_url + "/users/login";
        let credential = self.loginForm;
        if (self.$refs.loginForm.validate()) {
          self.axios.post(api, credential)
            .then(res => {
              // eslint-disable-next-line
              let userProfile = res.data;
              userProfile.type = 'self';
              localStorage.setItem("factchecker_profile", JSON.stringify(userProfile));
              location.reload();
            })
            .catch((err) => {
              if (err.response.status === 400) {
                self.loginMessage = 'Wrong username or password.';
                self.loginForm = {
                  username: '',
                  password: ''
                }
              }
            });
        }
      },
      userLogout() {
        localStorage.removeItem('factchecker_profile');
        this.profile = {
          username: 'guest',
          fullname: 'Guest',
          email: 'No email',
          imageUrl: '',
        };
        location.reload();
        this.goToMain();
      },
      goToMain() {
        this.$router.push({
          name: "Main"
        });
      },
      userRegister() {
        let self = this;
        let api = self.api_url + "/users/";
        let register = self.registerForm;
        register.type = 'self';
        if (self.$refs.registerForm.validate()) {
          self.axios.post(api, register).then(() => {
            // eslint-disable-next-line
            localStorage.setItem("factchecker_profile", JSON.stringify(register));
            location.reload();
          });
        }
      },
      onSignInSuccess(googleUser) {
        // `googleUser` is the GoogleUser object that represents the just-signed-in user.
        // See https://developers.google.com/identity/sign-in/web/reference#users
        let googleProfile = googleUser.getBasicProfile() // etc etc
        this.registerForm = {
          username: googleProfile['Eea'],
          fullname: googleProfile['ig'],
          password: '123123123',
          email: googleProfile['U3'],
          imageUrl: googleProfile['Paa'],
          type: 'google'
        };
        this.userRegister();
        localStorage.setItem("factchecker_profile", JSON.stringify(this.registerForm));
        location.reload();
      },
      changeLang(lang) {
        this.$i18n.locale = lang.value;
        this.$moment.locale(lang.moment);
        this.$forceUpdate();
      },
      selectLang(lang) {
        localStorage.setItem("factchecker_language", JSON.stringify(lang));
        location.reload();
      },
      initLang() {
        if (this.selectedLang == null) {
          this.selectedLang = this.langs[1];
        }
        this.$i18n.locale = this.selectedLang.value;
        this.$moment.locale(this.selectedLang.moment);
      }
    },
    mounted() {
      this.initLang();
    },
    created() {},
  };
</script>

<style>
  
</style>
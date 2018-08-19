<template>
	<v-content>
		<v-container grid-list-xl class="mt-3">
			<v-layout justify-center align-center wrap v-if="isLoading">
				<v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
			</v-layout>
			<v-layout row wrap>
				<v-flex xs12 sm6>
					<v-card>
						<v-card-media :src="fact.image_url" height="300px"></v-card-media>
						<v-card-title primary-title>
							<div>
								<h3 class="headline mb-0">#{{$route.params.id}} - {{fact.title}}</h3>
								<div>{{fact.description}}</div>
								<h3 class="subtitle mb-0 mt-3" v-if="fact.ref_url[0]!=''">Reference URL</h3>
								<a style="display:block" :href="url" target="_blank" v-for="url in fact.ref_url" :key="url.id">{{url}}</a>
							</div>
						</v-card-title>
					</v-card>
				</v-flex>
				<v-flex xs12 sm6>
					<v-layout class="px-4 mb-2">
						<h3 class="display-1">Evidence</h3>
						<v-btn icon color="pink" style="top:-5px" @click="openModal()">
							<v-icon>add</v-icon>
						</v-btn>
						<v-spacer></v-spacer>
						<v-btn flat icon color="pink" @click="changeSortOrder()" v-if="selectedSortIndex<2">
							<v-icon v-if="sortOrder==1">arrow_downward</v-icon>
							<v-icon v-if="sortOrder==-1">arrow_upward</v-icon>
						</v-btn>
						<v-menu offset-y>
							<v-btn flat slot="activator" color="primary" dark>
								{{sortList[selectedSortIndex]}}
							</v-btn>
							<v-list>
								<v-list-tile v-for="(item, index) in sortList" :key="index" @click="selectSort(index)">
									<v-list-tile-title>{{item}}</v-list-tile-title>
								</v-list-tile>
							</v-list>
						</v-menu>
					</v-layout>
					<v-expansion-panel popout expand>
						<v-expansion-panel-content v-for="evidence in sortedEvidences" :key="evidence.id">
							<div slot="header" v-if="evidence.support=='1'">
								Evidence #{{evidence.id}} - 
								<span class="green--text">Support</span> with {{evidence.trust_count}} trust<span v-if="evidence.trust_count>1">s</span>
							</div>
							<div slot="header" v-if="evidence.support=='0'">
								Evidence #{{evidence.id}} - 
								<span class="red--text">Aginst</span> with {{evidence.trust_count}} trust<span v-if="evidence.trust_count>1">s</span>
							</div>
							<v-card>
								<v-card-media :src="evidence.image_url" height="150px">
									<v-layout>
										<v-spacer></v-spacer>
										<v-btn class="ma-4" @click="addTrust(evidence)" :class="{'green':evidence.trusted && evidence.support=='1','red':evidence.trusted && evidence.support=='0'}">
											<v-icon left>thumb_up</v-icon>
											I trust it
										</v-btn>
									</v-layout>
								</v-card-media>
								<v-card-text>{{evidence.text}}</v-card-text>
								<v-card-text>
									<span class="caption">Created {{evidence.moment}}</span>
								</v-card-text>
							</v-card>
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-flex>
			</v-layout>
			<newEvidenceModal :dialog="dialog" :factId="$route.params.id"></newEvidenceModal>
			<v-snackbar v-model="snackbar" :bottom="true" :right="true" :timeout="3000">
				Trusted! The truth will finally be exposed!
				<v-btn color="pink" flat @click="snackbar = false">
					Close
				</v-btn>
			</v-snackbar>
		</v-container>
	</v-content>
</template>

<script>
	import newEvidenceModal from "@/components/newEvidence.vue";
	const api_domain = 'http://localhost:3000/api';
	// const img_server_domain = 'http://localhost:8080/uploads/';
	var moment = require('moment');
	
	export default {
		components: {
			newEvidenceModal
		},
		data: () => ({
			dialog: false,
			fact: {},
			evidences: [],
			isLoading: true,
			sortList: ['Created at', 'Number of Trust', 'Support', 'Aginst'],
			sortOrder: 1,
			selectedSortIndex: 0,
			snackbar: false,
		}),
		computed: {
			sortedEvidences: function() {
				let self = this;
				if (self.selectedSortIndex == 0) {
					return self.evidences.sort(function(a, b) {
						return (b.createdAt - a.createdAt) * (self.sortOrder);
					});
				}
				if (self.selectedSortIndex == 1) {
					return self.evidences.sort(function(a, b) {
						return (b.trust_count - a.trust_count) * (self.sortOrder);
					});
				}
				if (self.selectedSortIndex == 2) {
					return self.evidences.filter((evidence)=> {
						return (evidence.support=='1');
					});
				}
				if (self.selectedSortIndex == 3) {
					return self.evidences.filter((evidence)=> {
						return (evidence.support=='0');
					});
				}
			},
		},
		methods: {
			getFact() {
				const self = this;
				let api = api_domain + "/facts/" + this.$route.params.id;
				this.axios.get(api).then(res => {
					self.fact = res.data;
					self.fact.ref_url = self.fact.ref_url.split(',');
					self.isLoading = false;
				});
			},
			getEvidences() {
				const self = this;
				let api = api_domain + "/facts/" + this.$route.params.id + "/evidences";
				this.axios.get(api).then(res => {
					self.evidences = res.data;
					self.evidences.forEach((el) => {
						el.moment = moment(parseInt(el.createdAt)).fromNow()
					});
					self.isLoading = false;
				});
			},
			addView() {
				let api = api_domain + "/facts/" + this.$route.params.id + "/add_view";
				this.axios.get(api).then(() => {
					// eslint-disable-next-line
					console.log("Added view");
				});
			},
			addTrust(evidence) {
				let self = this;
				if (!evidence.trusted) {
					let api = api_domain + "/facts/" + this.$route.params.id + "/evidences/" + evidence.id + "/add_trust";
					this.axios.get(api).then(() => {
						// eslint-disable-next-line
						console.log("Added trust");
					});
				}
				self.snackbar = true;
				evidence.trusted = true;
			},
			openModal() {
				this.dialog = false;
				this.dialog = true;
			},
			selectSort(index) {
				this.selectedSortIndex = index;
			},
			changeSortOrder() {
				this.sortOrder = this.sortOrder * (-1);
			},
		},
		created() {
			this.getEvidences();
		},
		mounted() {
			this.getFact();
			//	this.getEvidences();
			this.addView();
		}
	};
</script>

<style>
	.truncate {
		display: block;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
let ipUrl = "";
switch (process.env.envConstants) {
  case "pro":
    ipUrl = "http://istgcl.com/agent-core";
    break;
  case "pre":
    ipUrl = "http://121.42.231.22/agent-core";
    break;
  case "dev":
    ipUrl = "http://192.168.0.181/agent-core";
    break;
  default:
    break;
}

const servicePath = {
  // 登录API
  getLogin: ipUrl + "/login", // 登录
  getLogout: ipUrl + "/logout", // 退出登录
  //管理员消息未读数量
  adminListCounts: ipUrl + "/agentMessage/adminListCounts",
  menusVisible: ipUrl + "/menu/menus-visible/", //首页左侧菜单展示
  //导出权限
  exportEnable:ipUrl + '/menu/export-enable',
  // 管理员界面
  getAgentLevelList: ipUrl + "/agentLevelAdmin/list", // 管理员-查询代理等级列表
  updateAgentUserAdmin: ipUrl + "/sysUserAdmin/updateAgentUser", //修改代理人信息
  getAgentUserDetail: ipUrl + "/sysUser/selectAgentUserDetail", // 代理人信息
  selectList: ipUrl + "/degradationReasonAdmin/selectList", //查询降级原因配置列表
  checkPhonenumber: ipUrl + "/sysUserAdmin/checkPhonenumber", //验证手机好是否已经注册
  //首页
  fundAccount: ipUrl + "/index/fund-account", //统计分佣数据
  itemOrder: ipUrl + "/index/item-order", //统计订单
  withdraw: ipUrl + "/index/withdraw", //统计体现记录
  indexAgent: ipUrl + "/index/agent", //统计代理人/消费者会员人数
  incomeToBePay: ipUrl + "/index/income-to-be-pay", //统计待收益
  agentCurve: ipUrl + "/index/agent-curve", //代理人曲线
  memberCurve: ipUrl + "/index/member-curve", //消费者会员曲线
  amountCurve: ipUrl + "/index/amount-curve", //消费额曲线
  orderCurve: ipUrl + "/index/order-curve", //订单曲线
  incomeCurve: ipUrl + "/index/income-curve", //分佣收益曲线
  waitingIncomeCurve: ipUrl + "/index/waiting-income-curve", //分佣待收益曲线
  //代理人
  selectAgentUserDetailPC: ipUrl + "/agentInformation/selectAgentUserDetailPC", //分销查询代理人详情
  selectAgentSelectionPC: ipUrl + "/agentInformation/selectAgentSelectionPC", //分销查询代理人关系
  selectAgentUserNumsPC: ipUrl + "/agentInformation/selectAgentUserNumsPC", //分销查询代理人和消费者会员总人数
  selectAgentUserListPC: ipUrl + "/agentInformation/selectAgentUserListPC", //分销查询代理人列表
  //老板审核
  agentApply: ipUrl + "/agentApply/list", //分页查询审核列表
  agentApplyDetail: ipUrl + "/agentApply/detail", //通过主键查询单挑数据，详情
  auditAgent: ipUrl + "/agentApply/auditAgent", //审核代理人
  historyList: ipUrl + "/agentApply/historyList", //分页查询审核历史列表
  //职员管理
  insertstaff: ipUrl + "/degradationReasonAdmin/insert", //添加降级原因
  delete: ipUrl + "/degradationReasonAdmin/delete", //删除降级原因
  update: ipUrl + "/degradationReasonAdmin/update", //修改降级原因
  getAgentLevelList: ipUrl + "/agentLevelAdmin/list", // 管理员-获取代理等级列表
  getAgentLevelEdit: ipUrl + "/agentLevelAdmin/edit", // 管理员-编辑保存等级信息
  getById: ipUrl + "/agentLevelAdmin/getById", //根据ID查询等级详情
  getInterestsConfigList: ipUrl + "/rightInterestsConfigAdmin/list", // 管理员-根据等级ID查询权益列表
  getInterestsConfigDelete: ipUrl + "/rightInterestsConfigAdmin/delete", // 管理员-根据ID删除权益
  getInterestsConfigById: ipUrl + "/rightInterestsConfigAdmin/getById", // 管理员-根据权益ID查询权益详情
  getInterestsConfigEdit: ipUrl + "/rightInterestsConfigAdmin/edit", // 管理员-编辑保存权益
  getInterestsConfigAdd: ipUrl + "/rightInterestsConfigAdmin/add", // 管理员-添加权益
  // 管理员-新增代理人
  getListAdminAgent: ipUrl + "/sysUserAdmin/listAdminAgent", // 管理员-查询手动添加的代理人
  getAddAdminAgent: ipUrl + "/sysUserAdmin/add", // 管理员-手动添加代理人
  getUpdateAdminAgent: ipUrl + "/sysUserAdmin/update", // 管理员-修改手动添加的代理人
  selectAgentUserDetail: ipUrl + "/sysUserAdmin/selectAgentUserDetail", // 管理员-查询代理人信息
  getregisterSmsCode: ipUrl + "/sysUserAdmin/registerSmsCode", // 管理员-添加代理人发送短信
  // 财务
  getBankList: ipUrl + "/bank/allList", // 获取银行列表
  getDrawAdminList: ipUrl + "/agentWithdraw/adminList", // 分页查询提现申请列表
  getRecordList: ipUrl + "/agentWithdrawRecord/list", // 管理员-提现记录分页查询
  getagentMessageAdminList: ipUrl + "/agentMessage/adminList", // 系统消息列表
  getagentMessageDetail: ipUrl + "/agentMessage/detail", // 消息列表详情
  getagentMessageStatus: ipUrl + "/agentMessage/updateNotReadMessage", // 已读消息
  // 管理员查看降级
  getselectSubstandardStaff: ipUrl + "/sysUserAdmin/selectSubstandardStaff", // 降级审核列表
  getselectStaffDetail: ipUrl + "/sysUserAdmin/selectStaffDetail", // 降级详情
  getsaveDegradation: ipUrl + "/sysUserAdmin/saveDegradation", // 保存降级信息
  getselectNoDemotion: ipUrl + "/sysUserAdmin/selectNoDemotion", // 暂不降级列表
  // 佣金记录
  getcommissionList: ipUrl + "/agentWithdraw/commissionList", // 佣金记录
  getcommissionDetail: ipUrl + "/agentWithdraw/commissionDetail", // 佣金记录详情
  getcommissionDetailList: ipUrl + "/agentWithdraw/commissionDetailList", // 佣金记录详情列表
  newBonusList: ipUrl + "/agentWithdraw/newBonusList", //新人奖金列表
  newBonusDetail: ipUrl + "/agentWithdraw/newBonusDetail", //新人奖金-个人详情
  newBonusDetailList: ipUrl + "/agentWithdraw/newBonusDetailList", //新人奖金-个人详情-具体收益列表
  //营销
  uploadPostersUrl: ipUrl + "/sysUserAdmin/uploadPostersUrl", //上传海报
  selectPostersInfo: ipUrl + "/sysUserAdmin/selectPostersInfo", //海报配置信息

  //权限
  insert: ipUrl + "/sysAdmin/insert", //新增数据
  sysAdminupdate: ipUrl + "/sysAdmin/update", //修改数据
  menuTreeData: ipUrl + "/menu/menuTreeData", //加载所有菜单列表树
  roleinsert: ipUrl + "/role/insert", //新增角色
  roleupdate: ipUrl + "/role/update", //修改数据
  updateMenus: ipUrl + "/sysAdmin/update/menus", //修改权限
  rolepubList: ipUrl + "/role/pubList", //分页查询公共角色列表
  privateRoleMenuTreeData: ipUrl + "/menu/privateRoleMenuTreeData/", //根据用户id查询私有角色菜单列表树
  publicRoleMenuTreeData: ipUrl + "/menu/publicRoleMenuTreeData/", //根据角色id查询公共角色菜单列表树
  getDrawPass: ipUrl + "/agentWithdraw/withdrawPass", // 同意提现申请
  getDrawNotPass: ipUrl + "/agentWithdraw/withdrawNotPass", // 拒绝提现申请
  getDrawDetail: ipUrl + "/agentWithdraw/detail", // 提现详情

  // 权限管理
  getAdminList: ipUrl + "/sysAdmin/list", //查询管理员账户列表
  freezeAdmin: ipUrl + "/sysAdmin/freeze", //冻结管理员账户
  deleteAdmin: ipUrl + "/sysAdmin/delete", //删除管理员账户
  getRoleList: ipUrl + "/role/list", //分页查询所有角色列表
  deleteRole: ipUrl + "/role/delete", //删除角色

  // 财务统计
  getRealTimeCount: ipUrl + "/agentWithdraw/realTimeCount", // 实时统计
  getWithdrawalPeopleCount: ipUrl + "/agentWithdraw/withdrawalPeopleCount", // 提现人数折线图
  getWithdrawalCount: ipUrl + "/agentWithdraw/withdrawalCount", // 提现笔数折线图
  getWithdrawalNumCount: ipUrl + "/agentWithdraw/withdrawalNumCount", // 提现金额折线图
  getWithdrawalCapitaCount: ipUrl + "/agentWithdraw/withdrawalCapitaCount", // 提现人均金额折线图
  getWithdrawalWayCount: ipUrl + "/agentWithdraw/withdrawalWayCount", // 提现方式饼状图

  // 讲师基础信息API
  getSelectTeacherListPC: ipUrl + "/teacherAndCourse/selectTeacherListPC", // 获取讲师列表
  getSysTeacherInfoEditPC: ipUrl + "/teacherAndCourse/editPC", // 添加讲师
  getTeacherAndCourseUpdate: ipUrl + "/teacherAndCourse/update", // 编辑讲师
  getSysTeacherInfoEnable: ipUrl + "/teacherAndCourse/enable", // 启用/不启用讲师
  getSelectAgentTimeList: ipUrl + "/teacherAndCourse/selectAgentTimeList", // 查询代理人预约记录
  getSelectAgentTimeDetail: ipUrl + "/teacherAndCourse/selectAgentTimeDetail", // 查询代理人预约记录的详情
  getSysTeacherInfoById: ipUrl + "/sysTeacherInfo/getById", // 查询讲师基本信息
  getSysTeacherInfoImportUpload: ipUrl + "/sysTeacherInfo/importUpload", // 上传讲师图片
  addTeacherAndCourse: ipUrl + "/teacherAndCourse/add", // 添加讲师
  deleteTeacherAndCourse: ipUrl + "/teacherAndCourse/delete", // 删除讲师

  // 讲师课程可预约时间API
  getSysCourseTimeSelectAll: ipUrl + "/sysCourseTime/selectAll", // 查询指定月份发布的记录
  setSysCourseTimeInsert: ipUrl + "/teacherAndCourse/insertCourse", // 新增课程时间数据
  getSysCourseTimeUpdate: ipUrl + "/teacherAndCourse/updateCourse", // 修改课程时间数据
};

export default servicePath;

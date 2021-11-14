import fetch from '@/config/fetch'

/**
 * 管理员登陆
 */

export const login = data => fetch('/admin/login', data, 'POST');

/**
 * 管理员退出
 */

export const signout = () => fetch('/admin/signout');


/**
 * 找回密码
 */
export const findpassword = () => fetch('/admin/findpassword');

/**
 * 获取管理员信息
 */

export const getAdminInfo = () => fetch('/admin/info');

/**
 * 某一天api请求量
 */

export const apiCount = date => fetch('/statis/api/' + date + '/count');

/**
 * 所有api请求量
 */

export const apiAllCount = () => fetch('/statis/api/count');

/**
 * 所有api请求信息
 */

export const apiAllRecord = () => fetch('/statis/api/all');

/**
 * 某一天的新增用户注册量
 */

export const userCount = date => fetch('/statis/user/' + date + '/count');

/**
 * 某一天测试新增数据量
 */

export const testCount = date => fetch('/statis/test/' + date + '/count');


/**
 * 某一天管理员新增量
 */

export const adminCount = date => fetch('/statis/admin/' + date + '/count');
/**
 * 获取管理员数量
 */

export const getAdminCount = data => fetch('/statis/admin/count', data);
/**
 * 获取推送数量
 */

export const getArticalCount = data => fetch('/statis/article/count', data);

/**
 * 获取用户数量
 */

export const getUserCount = data => fetch('/v1/user/count', data);
/**
 * 获取测试数量
 */

export const getTestCount = data => fetch('/psychology/test/count', data);


/**
 * 添加文章
 */

export const addArticle = data => fetch('/article/addarticle', data, 'POST');

/**
 * 获取推送列表
 */

export const getArticle = data => fetch('/psychology/article', data);
/**
 * 获取推送测试
 */

export const getArticleTest = articleid => fetch('/psychology/getarticletest/' + articleid);
/**
 * 推送详情
 */

export const getArticleDetail = articleid => fetch('/psychology/article/' + articleid);

/**
 * 添加管理员
 */

export const addAdmin = data => fetch('/admin/addAdmin', data, 'POST');
/**
 * 更新管理员信息
 */

export const updateAdmin = data => fetch('/admin/updateadmin', data, 'POST');

/**
 * 获取管理员列表
 */

export const adminList = data => fetch('/admin/all', data);

/**
 * 删除管理员
 */

export const deleteAdmin = adminid => fetch('/admin' + adminid, {}, 'DELETE');


/**
 * 添加测试
 */

export const addTest = data => fetch('/psychology/addtest', data, 'POST');

/**
 * 获取测试列表
 */

export const getTest = data => fetch('/psychology/test', data);
/**
 * 删除测试
 */


/**
 * 获取用户列表
 */

export const getUserList = data => fetch('/v1/user/list', data);

/**
 * 获取用户信息
 */

export const getUserInfo = userid => fetch('/v1/user/' + userid);


/**
 * 删除用户信息
 */
// export const deleteUser = userid => fetch('/v1/user/' + testid, {}, 'DELETE');


/**
 * 获取用户分布信息
 */

export const getUserCity = () => fetch('/v1/user/city/count');


export const queryArticleByName = data => fetch('/v1/queryArticleByName', data);

export const queryTestByTitle = data => fetch('/test/queryTestByTitle', data);

export const addPush = data => fetch('/push/insertPush', data, 'POST');

export const addTable = data => fetch('/test/addTable', data, 'POST');

export const addExperiment = data => fetch('/test/addExperiment', data, 'POST');

export const queryTableByTitle = data => fetch('/test/queryTableByTitle', data);

export const queryExperimentByTitle = data => fetch('/test/queryExperimentByTitle', data);

export const getAnswerList = data => fetch('/test/queryAnswerList', data);

export const queryExperimentById = data => fetch('/test/queryExperimentById', data);

export const updateExperiment = data => fetch('/test/updateExperiment', data, 'POST');

export const queryTableById = data => fetch('/test/queryTableById', data);

export const updateTable = data => fetch('/test/updateTable', data, 'POST');

export const updateTest = data => fetch('/test/updateTest', data, 'POST');

export const addQuestion = data => fetch('/test/addQuestion', data, 'POST');

export const queryTestCnt = data => fetch('/psychology/testCnt', data, 'POST', 'not_fetch')

export const queryTestList = data => fetch('/psychology/test', data, 'POST', 'not_fetch')

export const queryQuestionList = data => fetch('/test/queryQuestionList', data, 'POST', 'not_fetch')

export const mohuQueryQuestion = data => fetch('/test/mohuQueryQuestion', data, 'POST', 'not_fetch')

export const mohuQueryUser = data => fetch('/user/mohuQueryUser', data, 'POST', 'not_fetch')

export const mohuQueryArticle = data => fetch('/article/mohuQueryArticle', data, 'POST', 'not_fetch')

export const mohuQueryTest = data => fetch('/test/mohuQueryTest', data, 'POST', 'not_fetch')

export const deleteQuestion = data => fetch('/test/deleteQuestion', data, 'POST', 'not_fetch')

export const queryQuestionById = data => fetch('/test/queryQuestionById', data, 'POST', 'not_fetch')

export const updateQuestion = data => fetch('/test/updateQuestion', data, 'POST')

export const queryQuestionCount = data => fetch('/test/queryQuestionCount', data)

export const queryAllTables = data => fetch('/test/queryAllTables')

export const queryAllExperiments = data => fetch('/test/queryAllExperiments')

export const deleteTable = data => fetch('/test/deleteTableById', data)

export const deleteExperiment = data => fetch('/test/deleteExperimentById', data)

export const deleteTest = data => fetch('/test/deleteTestById', data)

export const queryTestById = data => fetch('/test/queryTestById', data, 'POST', 'not_fetch')

export const insertTestGroups = data => fetch('/test/insertTestGroups', data, 'POST')

export const queryTestGroupsByTestId = data => fetch('/test/queryTestGroupsByTestId', data, 'POST', 'not_fetch')

export const queryTestListByUserId = data => fetch('/test/queryTestListByUserId', data, 'POST', 'not_fetch')

export const insertTestGroup = data => fetch('/test/insertTestGroup', data, 'POST', 'not_fetch')

export const isQuestionExist = data => fetch('/test/isQuestionExist', data, 'POST', 'not_fetch')

/* 测试接口 */
export const queryTestGroupList = data => fetch('/test/queryTestGroupList', data, 'POST', 'not_fetch')

export const queryTestGroupCount = data => fetch('/test/queryTestGroupCount', data, 'POST', 'not_fetch')

export const deleteTestGroup = data => fetch('/test/deleteTestGroup', data, 'POST', 'not_fetch')

/* 推送接口*/
export const queryPushCount = data => fetch('/push/queryPushCount', data, 'POST')

export const queryPushList = data => fetch('/push/queryPushList', data, 'POST', 'not_fetch')


export const queryPushById = data => fetch('/push/queryPushById', data, 'POST', 'not_fetch')

export const updatePush = data => fetch('/push/updatePush', data, 'POST')

export const deletePush = data => fetch('/push/deletePush', data, 'POST', 'not_fetch')

/* 用户接口 */
export const queryUserById = data => fetch('/user/queryUserById', data, 'POST', 'not_fetch')

export const updateUser = data => fetch('/user/updateuser', data, 'POST');

export const addUser = data => fetch('/user/addUser', data, 'POST');

export const deleteUser = data => fetch('/user/deleteUser', data, 'POST', 'not_fetch')



/* 答案接口 */
export const queryAnswerResult = data => fetch('/answer/queryAnswerResult', data, 'POST', 'not_fetch')

export const deleteAnswer = data => fetch('/answer/deleteAnswer', data, 'POST', 'not_fetch')

export const updateAnswer = data => fetch('/answer/updateAnswer', data, 'POST');

/* 量表接口 */
export const mohuQueryTableByTitle = data => fetch('/test/mohuQueryTableByTitle', data, 'POST', 'not_fetch')

/* 文章接口 */
export const queryArticleList = data => fetch('/article/queyrArticleList', data, 'POST', 'not_fetch')

export const deleteArticle = data => fetch('/article/deleteArticle', data, 'POST', 'not_fetch')

export const queryArticleById = articleid => fetch('/article/queryArticleById/'+articleid)

export const updateArticle = data => fetch('/article/updateArticle', data, 'POST')

export const queryArticleCount = data => fetch('/article/queryArticleCount', data, 'POST', 'not_fetch')

export const queryRedisAnswerVO = data => fetch('/answer/queryRedisAnswerVO', data, 'POST', 'not_fetch')

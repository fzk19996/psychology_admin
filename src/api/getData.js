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
 * 添加推送
 */

export const addArticle = data => fetch('/psychology/addarticle', data, 'POST');

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
 * 删除推送
 */

export const deleteArticle = articleid => fetch('/psychology/article/' + articleid, {}, 'DELETE');

/**
 * 更新推送信息
 */

export const updateArticle = data => fetch('/psychology/updatearticle', data, 'POST');

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
 * 更新测试
 */

export const updateTest = data => fetch('/psychology/updatetest', data, 'POST');

/**
 * 获取测试列表
 */

export const getTest = data => fetch('/psychology/test', data);
/**
 * 删除测试
 */

export const deleteTest = testid => fetch('/psychology/test' + testid, {}, 'DELETE');

/**
 * 获取用户列表
 */

export const getUserList = data => fetch('/v1/user/list', data);

/**
 * 获取用户信息
 */

export const getUserInfo = userid => fetch('/v1/user/' + userid);

/**
 * 更新用户信息
 */

export const updateUser = data => fetch('/v1/user/updateuser', data, 'POST');
/**
 * 删除用户信息
 */
export const deleteUser = userid => fetch('/v1/user/' + testid, {}, 'DELETE');


/**
 * 获取用户分布信息
 */

export const getUserCity = () => fetch('/v1/user/city/count');


export const queryArticleByName = data => fetch('/v1/queryArticleByName', data);

export const queryTestByTitle = data => fetch('/test/queryTestByTitle', data);

export const addPush = data => fetch('/psychology/addPush', data, 'POST');

export const addTable = data => fetch('/test/addTable', data, 'POST');

export const addExperiment = data => fetch('/test/addExperiment', data, 'POST');

export const queryTableByTitle = data => fetch('/test/queryTableByTitle', data);

export const queryExperimentByTitle = data => fetch('/test/queryExperimentByTitle', data);

export const getAnswerList = data => fetch('/test/queryAnswerList', data);

export const updateAnswer = data => fetch('/test/updateAnswer', data, 'POST');
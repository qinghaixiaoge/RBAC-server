function buildMenuTree(menus) {
  // 创建一个映射表，方便通过id查找菜单项
  const menuMap = new Map();

  // 初始化所有菜单项，添加children数组
  menus.forEach((menu) => {
    menuMap.set(menu.id, {
      ...menu,
      children: [],
    });
  });

  // 构建树形结构
  const tree = [];
  menuMap.forEach((menu) => {
    // console.log(menu);

    if (menu.parentId === null) {
      // 顶层菜单，直接添加到树中
      tree.push(menu);
    } else {
      // 子菜单，添加到父菜单的children中
      const parent = menuMap.get(menu.parentId);
      if (parent) {
        parent.children.push(menu);
      }
    }
  });

  return tree;
}
function transformToTreeStructure(originalData) {
  // 先转换原始数据为扁平结构
  const transformedData = {
    userId: originalData.id,
    username: originalData.username,
    visible: originalData.visible,
    roles: originalData.roles.map((role) => {
      return {
        id: role.id,
        roleName: role.roleName,
        visible: role.visible,
      };
    }),
    menus: buildMenuTree(
      originalData.roles.flatMap((role) =>
        role.menus.map((menu) => ({
          id: menu.id,
          name: menu.name,
          path: menu.path,
          component: menu.component,
          parentId: menu.parentId,
          icon: menu.icon,
          perms: menu.perms,
          type: menu.type,
          orderNum: menu.orderNum,
          visible: menu.visible,
          keepAlive: menu.keepAlive,
          auth: menu.auth,
        }))
      )
    ),
  };

  return transformedData;
}

function toTree(flatMenus) {
  // 创建ID到节点的映射
  const nodeMap = {};
  flatMenus.forEach((menu) => {
    nodeMap[menu.id] = { ...menu, children: [] };
  });

  // 构建树形结构
  const tree = [];
  flatMenus.forEach((menu) => {
    const node = nodeMap[menu.id];
    if (menu.parentId === null || menu.parentId === undefined) {
      tree.push(node);
    } else {
      const parent = nodeMap[menu.parentId];
      if (parent) {
        parent.children.push(node);
      }
    }
  });

  return tree;
}

module.exports = { transformToTreeStructure, toTree };

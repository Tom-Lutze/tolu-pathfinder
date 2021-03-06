import { Menu, Slider } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import {
  AlgoTypes,
  ExtraMenuTypes,
  GraphTypes,
  MenuTypes,
} from '../../interfaces/Interfaces';
import { SettingContexts } from '../settings/SettingsProvider';
import { settingsParams } from '../settings/SettingsParams';
import { mainMenuStrings } from '../constants/Strings';

/**
 * Provides an interface to specify the graph type, algorithm and settings with a {@link Menu} component.
 */
const Sidebar = (props: { scrollbar?: any; collapsed?: boolean }) => {
  const subMenuitems = [];

  const updateTimestampContext: any = useContext(
    SettingContexts[ExtraMenuTypes.UpdateTimestamp]
  );
  const algoContext: any = useContext(SettingContexts[MenuTypes.Algo]);
  const graphContext: any = useContext(SettingContexts[MenuTypes.Graph]);

  const defaultOpenKeysState = [
    MenuTypes[MenuTypes.Graph],
    MenuTypes[MenuTypes.Algo],
  ];

  const [openKeys, setOpenKeys] = useState(defaultOpenKeysState);

  useEffect(() => {
    if (props.collapsed) setOpenKeys([]);
    else setOpenKeys(defaultOpenKeysState);
  }, [props.collapsed]);

  for (const menuType in MenuTypes) {
    if (!isNaN(Number(menuType))) continue;

    const menuItems = [];
    const menuParam = settingsParams[MenuTypes[menuType]];

    if (!menuParam) continue;

    for (const currType in menuParam.type) {
      if (!isNaN(Number(currType))) continue;
      if (
        menuType == MenuTypes[MenuTypes.Algo] ||
        menuType == MenuTypes[MenuTypes.Graph]
      ) {
        const menuItem = (
          <Menu.Item key={currType}>
            {menuParam.strings[menuParam.type[currType]]}
          </Menu.Item>
        );
        menuItems.push(menuItem);
      } else if (menuType == MenuTypes[MenuTypes.Settings]) {
        const { stateVal, setStateVal } = useContext(
          SettingContexts[MenuTypes.Settings][menuParam.type[currType]]
        );

        const menuChildParam =
          settingsParams[MenuTypes.Settings].children[menuParam.type[currType]];

        const menuItem = (
          <Menu.ItemGroup
            key={`mig-${currType}`}
            title={menuParam.strings[menuParam.type[currType]]}
          >
            <Menu.Item
              key={`mi-${currType}`}
              className="tolu-settings-slider-parent"
            >
              <Slider
                defaultValue={stateVal}
                disabled={false}
                onAfterChange={(value: number) => {
                  setStateVal(value);
                }}
                min={menuChildParam.min}
                max={menuChildParam.max}
                step={menuChildParam.step}
              />
            </Menu.Item>
          </Menu.ItemGroup>
        );
        menuItems.push(menuItem);
      }
    }

    const subMenu = (
      <Menu.SubMenu
        key={`${menuType}`}
        icon={menuParam.icon}
        title={`${mainMenuStrings[MenuTypes[menuType]]}`}
        onTitleClick={(e) => {
          const newOpenKeys = props.collapsed ? [] : [...openKeys];
          if (openKeys.includes(e.key)) {
            newOpenKeys.splice(newOpenKeys.indexOf(e.key), 1);
          } else {
            newOpenKeys.push(e.key);
          }
          setOpenKeys(newOpenKeys);
          if (props.scrollbar.current)
            setTimeout(() => props.scrollbar.current.updateScroll(), 200);
        }}
      >
        {menuItems}
      </Menu.SubMenu>
    );
    subMenuitems.push(subMenu);
  }

  return (
    <Menu
      theme="dark"
      mode="inline"
      inlineIndent={14}
      selectedKeys={[
        GraphTypes[graphContext.stateVal],
        AlgoTypes[algoContext.stateVal],
      ]}
      openKeys={openKeys}
      onClick={(e) => {
        const menuType = MenuTypes[e.keyPath[1]];
        const menuParam = settingsParams[menuType];
        updateTimestampContext.setStateVal({
          ...updateTimestampContext.stateVal,
          [menuType]: new Date().getTime(),
        });
        if (menuType == MenuTypes.Algo) {
          algoContext.setStateVal(menuParam.type[e.keyPath[0]]);
        } else if (menuType == MenuTypes.Graph) {
          graphContext.setStateVal(menuParam.type[e.keyPath[0]]);
        }
      }}
      children={subMenuitems}
    />
  );
};

export default Sidebar;

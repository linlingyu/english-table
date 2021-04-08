import FlexLayout, { Model } from 'flexlayout-react';

const defaultLayout: any = {
    global: {
        tabSetEnableTabStrip: false,
        tabEnableFloat: false
    },
    layout: {
        type: 'row',
        children: [{
            type: 'tabset',
            active: true,
            children: [{
                type: 'tab',
                name: 'Word',
                component: 'Word'
            }]
        }]
    },
    borders: [{
        type: 'border',
        location: 'left',
        selected: 0,
        children: [{
            type: 'tab',
            name: 'Tree Pane',
            component: 'TreePane',
            enableClose: false
        }]
    }]
};
export function getLayout(layoutKey: string): Model {
    const layoutString: string | null = localStorage.getItem(layoutKey);
    return FlexLayout.Model.fromJson(layoutString ? JSON.parse(layoutString) : defaultLayout);
}
/// <reference types="react" />
import * as React from 'react';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Activity, IBotConnection, User, DirectLineOptions, CardActionTypes } from 'botframework-directlinejs';
import { ChatActions } from './Store';
export interface FormatOptions {
    showHeader?: boolean;
}
export declare type ActivityOrID = {
    activity?: Activity;
    id?: string;
};
export interface ChatProps {
    user: User;
    bot: User;
    botConnection?: IBotConnection;
    directLine?: DirectLineOptions;
    locale?: string;
    selectedActivity?: BehaviorSubject<ActivityOrID>;
    sendTyping?: boolean;
    formatOptions?: FormatOptions;
    resize?: 'none' | 'window' | 'detect';
}
export declare const sendMessage: (text: string, from: User, locale: string) => ChatActions;
export declare const sendFiles: (files: FileList, from: User, locale: string) => ChatActions;
export declare class Chat extends React.Component<ChatProps, {}> {
    private store;
    private botConnection;
    private activitySubscription;
    private connectionStatusSubscription;
    private selectedActivitySubscription;
    private chatviewPanel;
    private resizeListener;
    constructor(props: ChatProps);
    private handleIncomingActivity(activity);
    private setSize();
    private resetMessage();
    componentDidMount(): void;
    componentWillUnmount(): void;
    private setFocus();
    render(): JSX.Element;
}
export interface IDoCardAction {
    (type: CardActionTypes, value: string): void;
}
export declare const doCardAction: (botConnection: IBotConnection, from: User, locale: string, sendMessage: (value: string, user: User, locale: string) => void) => IDoCardAction;
export declare const sendPostBack: (botConnection: IBotConnection, text: string, from: User, locale: string) => void;
export declare const renderIfNonempty: (value: any, renderer: (value: any) => JSX.Element) => JSX.Element;
export declare const classList: (...args: (string | boolean)[]) => string;
export declare const konsole: {
    log: (message?: any, ...optionalParams: any[]) => void;
};

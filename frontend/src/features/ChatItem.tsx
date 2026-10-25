import type { Config } from "../types/Component"
import type { ChatItem } from "../types/Chat"
import Base from "../components/Base"
import Button from "../components/Button";
import COMP from "../const/component"
import Standard from "../dialogs/Standard"

export function ChatItem( data: ChatItem ): Config{
  const config: Config = new Base({
    key: "chat",
    className: "flexNone borderSolid borderBottomTiny lighterBorderColor paddingMedium cursorPointer alignItemsCenter",
    events: [
        {
            type: "click",
            self: true,
            callback: function(){
                window.location.hash = "chat/" + data.id;
            }
        }
    ],
    children: [
        new Base({
            className: "textEllipsis flexContent",
            setJSX: function(){
                return (
                    <div ref={this.domRef} className={this.className}>
                        { data.message }
                    </div>
                );
            }
        }),
        new Button({
            type: COMP.BUTTON.TYPE.TEXT,
            className: "marginLeftSmall errorColor errorBorderColor",
            text: "🗑",
            events: [
                {
                    type: "click",
                    self: true,
                    callback: function( e: Event ){
                        e.stopPropagation();
                        const self = this;
                        this.openDialog(Standard({
                            type: COMP.DIALOG.TYPE.WARNING,
                            message: "Do you want to delete this chat?",
                            confirm: function(){
                                self.request({
                                url: "http://localhost:5000/chat/delete",
                                data: {
                                    id: data.id
                                },
                                success: function(){
                                    self.openDialog(Standard({
                                        type: COMP.DIALOG.TYPE.SUCCESS,
                                        title: "Delete Chat Success",
                                        message: "The chat was deleted successfully",
                                        onClose: function(){
                                            const chats = self.getParent({ key: "chats" });
                                            chats?.updateChats();
                                        }
                                    }));
                                },
                                error: function( data: any ){
                                    self.openDialog(Standard({
                                        type: COMP.DIALOG.TYPE.ERROR,
                                        title: "Delete Chat Failed",
                                        message: data.message
                                    }));
                                }
                                });
                            }
                        }));
                    }
                }
            ]
        })
    ]
  });
  return config;
}

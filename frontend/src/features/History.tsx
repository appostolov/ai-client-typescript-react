import type { Config } from "../types/Component"
import Button from "../components/Button"
import Base from "../components/Base"
import COMP from "../const/component"
import Standard from "../dialogs/Standard"
import type { ChatSelect, ChatItem } from "../types/Chat"
import Node from '../components/Node'
import { ChatItem as ChatItemFunc } from "./ChatItem"

export default function History(): Config{
  const config: Config = {
    key: "history",
    className: "column",
    onInit: function(){
      const deleteAll = this.getChild({ key: "deleteAll" });
      const chats = this.getChild({ key: "chats" });

      deleteAll.addEffect(
        chats.state.chats,
        function( chats: ChatItem[] ){
          if( chats.length ) deleteAll.enable();
          else deleteAll.disable();
        }
      );
    },
    children: [
      new Base({
        className: "flexNone borderSolid borderBottomTiny lighterBorderColor paddingSmall",
        children: [
          new Button({
            text: "💬 New",
            onClick: function(){
              window.location.hash = "chat/new";
            }
          }),
          new Button({
            key: "deleteAll",
            type: COMP.BUTTON.TYPE.BORDER,
            className: "marginLeftSmall errorColor errorBorderColor",
            text: "🗑 Delete All",
            onClick: function(){
              const self = this;
              this.openDialog(Standard({
                type: COMP.DIALOG.TYPE.WARNING,
                message: "Do you want to delete all chats?",
                confirm: function(){
                  self.request({
                    url: "http://localhost:5000/chat/delete",
                    success: function(){
                      const history = self.getParent({ key: "history" });
                      const chats = history.getChild({ key: "chats" });
                      chats.updateChats();
                      self.openDialog(Standard({
                        type: COMP.DIALOG.TYPE.SUCCESS,
                        title: "Delete All Success",
                        message: "Everything is deleted"
                      }));
                    },
                    error: function( data: any ){
                      self.openDialog(Standard({
                        type: COMP.DIALOG.TYPE.ERROR,
                        title: "Delete All Failed",
                        message: data.message
                      }));
                    }
                  });
                }
              }));
            }
          })
        ]
      }),
      new Base({
        key: "chats",
        className: "column overflowAuto",
        chats: [],
        states: COMP.STATES.BASE.concat([ "chats" ]),
        onInit: function(){
          this.updateChats();
        },
        updateChats: function( offset: number ){
          this.setBusy( true );
          this.request({
            url: "http://localhost:5000/chat/select",
            data: {
              limit: 20,
              offset: offset || 0
            },
            success: function( data: ChatSelect ){
              this.setBusy( false );
              let chats: ChatItem[];
              if( offset ){
                chats = this.state.chats.value.concat( data.chats )
              }
              else chats = data.chats;
              
              this.state.chats.setter( chats );
            },
            error: function( data: any ){
              this.setBusy( false );
              this.openDialog(Standard({
                type: COMP.DIALOG.TYPE.ERROR,
                title: "Chat Select Failed",
                message: data.message
              }));
            }
          });
        },
        setJSX: function(){
          const chats: ChatItem[] = this.state.chats.value;
          return (
            <div ref={this.domRef} className={this.className}>
              {
                chats.map(( chat, index ) => {
                  const config = ChatItemFunc( chat );
                  config.parent = this.id;
                  return ( <Node key={index} config={config}/> )
                })
              }
            </div>
          );
        },
        events: [
          {
            type: "scroll",
            self: true,
            callback: function(){
              const scrollTop = this.node.scrollTop;
              const clientHeight = this.node.clientHeight;
              const scrollHeight = this.node.scrollHeight;
              const isAtBottom =  Math.ceil( scrollTop ) > Math.floor( scrollHeight - clientHeight );
              console.log( "scrollTop: " + scrollTop );
              console.log( "clientHeight: " + clientHeight );
              console.log( "scrollHeight: " + scrollHeight );
              if ( isAtBottom ) {
                const chats = this.state.chats.value;
                this.updateChats( chats.length );
              }
            }
          }
        ]
      })
    ]
  };
  return new Base( config );
}

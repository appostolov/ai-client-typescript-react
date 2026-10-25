import type { Config } from "../types/Component"
import Button from "../components/Button"
import Base from "../components/Base"
import Textarea from "../components/Textarea"
import COMP from "../const/component"
import Standard from "../dialogs/Standard"
import HashHelper from "../helpers/HashHelper"
import type { Answer, MessageSelect, Message } from "../types/Chat"
import { Message as ChatMessage } from "./Message"
import Node from '../components/Node'

export default function History(): Config {
  const config: Config = new Base({
    key: "chat",
    className: "column",
    children: [
      new Base({
        className: "flexNone borderSolid borderBottomTiny lighterBorderColor paddingSmall",
        children: [
          new Button({
            text: "⬅️ Back",
            onClick: function(){
              window.location.hash = "";
            }
          }),
          new Button({
            type: COMP.BUTTON.TYPE.BORDER,
            className: "marginLeftSmall errorColor errorBorderColor",
            text: "🗑 Delete",
            disabled: ( HashHelper.id() === "new" ),
            onClick: function(){
              const self = this;
              this.openDialog(Standard({
                type: COMP.DIALOG.TYPE.WARNING,
                message: "Do you want to delete this chat?",
                confirm: function(){
                  const id = HashHelper.id();
                  self.request({
                    url: "http://localhost:5000/chat/delete",
                    data: {
                      id: id
                    },
                    success: function(){
                      self.openDialog(Standard({
                        type: COMP.DIALOG.TYPE.SUCCESS,
                        title: "Delete Chat Success",
                        message: "The chat was deleted successfully",
                        onClose: function(){
                          window.location.hash = "";
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
          })
        ]
      }),
      new Base({
        key: "messages",
        className: "columnReverse overflowAuto paddingLarge",
        messages: [],
        states: COMP.STATES.BASE.concat([ "messages" ]),
        onInit: function(){
          this.updateChat();
        },
        updateChat: function( offset: number ){
          const id = HashHelper.id();
          if( id === "new" ){
            this.state.messages.setter( [] );
            return;
          }
          this.setBusy( true );
          this.request({
            url: "http://localhost:5000/message/select",
            data: {
              chat: id,
              limit: 20,
              offset: offset || 0
            },
            success: function( data: MessageSelect ){
              this.setBusy( false );
              let messages;
              if( offset ){
                messages = this.state.messages.value.concat( data.messages )
              }
              else messages = data.messages;
              
              this.state.messages.setter( messages );
            },
            error: function( data: any ){
              this.setBusy( false );
              this.openDialog(Standard({
                type: COMP.DIALOG.TYPE.ERROR,
                title: "Message Select Failed",
                message: data.message
              }));
            }
          });
        },
        messageAnswered: function( data: Answer ){
          const messages: Message[] = [];
          messages.push( data.message[1].choices[0].message );
          messages.push( data.message[0].messages[0] );
          this.state.messages.setter( messages.concat( this.state.messages.value ) );
        },
        events: [
          {
            type: "hashchange",
            node: window,
            callback: function(){
              this.updateChat();
            }
          },
          {
            type: "scroll",
            self: true,
            callback: function(){
              const scrollTop = this.node.scrollTop;
              const clientHeight = this.node.clientHeight;
              const scrollHeight = this.node.scrollHeight;
              const isAtTop = Math.abs(scrollTop) + clientHeight >= scrollHeight - 1;
              if ( isAtTop ) {
                const messages = this.state.messages.value;
                this.updateChat( messages.length );
              }
            }
          }
        ],
        setJSX: function(){
          const messages: Message[] = this.state.messages.value;
          return (
            <div ref={this.domRef} className={this.className}>
              {
                messages.map(( message, index ) => {
                  return ( <Node key={index} config={ChatMessage( message )}/> )
                })
              }
            </div>
          );
        }
      }),
      new Base({
        key: "textBlock",
        className: "flexNone column borderSolid borderTopTiny lighterBorderColor",
        onInit: function(){
          const textarea = this.getChild({ key: "textarea" });
          const button = this.getChild({ key: "send" });
          button.addEffect(
            textarea.state.text,
            ( value: string ) => {
              if( value ) button.enable()
              else button.disable()
            }
          );
        },
        children: [
          new Textarea({
            key: "textarea",
            placeholder: "Ask me anything...",
            className: "flexNone marginSmall paddingSmall fieldSizingContent"
          }),
          new Base({
            className: "flexNone paddingSmall rowReverse",
            children: [
              new Button({
                key: "send",
                text: "Send 🚀",
                disabled: true,
                onClick: function(){
                  const chat = this.getParent({ key: "chat" });
                  chat.setBusy( true );
                  const textBlock = this.getParent({ key: "textBlock" });
                  const textarea = textBlock.getChild({ key: "textarea" });
                  const text = textarea.getText();
                  let id = HashHelper.id();
                  if( id === "new" ) id = undefined;
                  this.request({
                    url: "http://localhost:5000/message/send",
                    data: {
                      request: {
                        messages: [
                          {
                            role: "user",
                            content: text
                          }
                        ],
                        model: 'openrouter/free'
                      },
                      chat: id
                    },
                    success: function( data: Answer ){
                      if( HashHelper.id() === "new" ) window.location.hash = "chat/" + data.chat;
                      chat.setBusy( false ); 
                      const messages = chat.getChild({ key: "messages" });
                      messages.messageAnswered( data );

                      const textBlock = this.getParent({ key: "textBlock" });
                      const textarea = textBlock.getChild({ key: "textarea" });
                      textarea.state.text.setter( "" );
                    },
                    error: function( data: any ){
                      this.openDialog(Standard({
                        type: COMP.DIALOG.TYPE.ERROR,
                        title: "Send Message Failed",
                        message: data.message
                      }));
                    }
                  });
                }
              })
            ]
          })
        ]
      })
    ]
  });
  return config;
}

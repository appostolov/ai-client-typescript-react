import Base from "../components/Base"

export default class Textarea extends Base{
    declare text: string | undefined
    declare onChange: Function | undefined
    declare onInput: Function | undefined
    declare className: string | undefined
    public states: string[] = [ "disabled", "text" ];

    public setJSX(){
      return (
        <textarea
          ref={this.domRef}
          className={ this.getTextareaCss() }
          onChange= {this?.onChange?.bind( this ) }
          onInput= {this?.onInput?.bind( this ) }
          disabled={ this.state.disabled.value }>
          {this?.text}
        </textarea>
      );
    }

    public setText( text: string ): void{
      this.state.text.setter( text );
    }

    protected getTextareaCss(): string{
        let css = "";

        if( this.className ) css = this.className;
        else css = "borderSolid borderSmall textBorderColor borderRadiusSmall";

        if( this.state.disabled.value ) css += " disabled";

        return css;
    }
}

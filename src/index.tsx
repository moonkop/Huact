function render (element: HuactElement, root: HTMLElement) {
    root.innerHTML = '';
    root.appendChild(renderNode(element));
}

function renderDomNode (element: HuactElement) {
    let ele = document.createElement(element.tagName as string);
    element.props && Object.keys(element.props).map(key => {
        if (key == 'children') {
            return;
        }
        let prop = element.props[key];
        if (key == 'className') {
            key = 'class';
        }
        if (typeof prop == 'function') {
            ele.addEventListener(key, prop);
        } else {
            ele.setAttribute(key, prop);

        }
    });
    if (element.props.children) {
        let childrens = element.props.children.map(item => {
            if (typeof item == "string" || typeof item == 'number') {

                return document.createTextNode(item);
            } else if (typeof item == 'object' && item.tagName) {
                return renderNode(item);
            }
        });
        childrens.map(item => {
            ele.appendChild(item);
        })
    }
    return ele;
}

function renderComponentNode (element: HuactElement) {
    let tagname = element.tagName as Component<any, any>;
    // @ts-ignore
    let component = new tagname()
    component.props = element.props;
    let root = renderComponent(component, false);

    return root;
}

function renderComponent (component, isUpdate) {

    let renderEle = component.render();
    let root = renderNode(renderEle);
    if (component.root) {
        component.root.parentNode.replaceChild(root, component.root);
    }
    component.root = root;
    return root;
}

function renderNode (element: HuactElement) {
    if (typeof element.tagName == "string") {
        return renderDomNode(element);
    } else {
        return renderComponentNode(element);
    }
}

interface HuactElement {
    tagName: string | Component<{}, {}>,
    props: { [key: string]: any, children: HuactElement[] } | null,
}

function createElement (tagName, props, ...children): HuactElement {
    return {
        tagName,
        props: {...props, children},
    }
}


class Component<P, S> {

    constructor (props) {
    }

    props: P;
    state: S;
    root: HTMLElement;

    render (): HuactElement {
        return null
    }

    setState (state: Partial<S>) {
        this.state = {...this.state, ...state};
        this.forceUpdate();
    }

    forceUpdate () {
        renderComponent(this, true);


    }

}

class First extends Component<{ haha: string }, { clickCount: number }> {
    constructor (props) {
        super(props);
        this.state = {
            clickCount: 0
        }
    }

    render (): HuactElement {
        return <div>
            <div click={() => {
                console.log('im clicked')
            }}>button
            </div>

            <div click={() => {
                this.setState({clickCount: this.state.clickCount + 1})
            }}>setState{this.state.clickCount}
            </div>

            <Second></Second>

            im first11{this.props.haha}
        </div>;
    }
}

class Second extends Component<{}, {}> {
    render () {
        return (
            <div>
                second ~~~
            </div>
        );
    }
}

console.log('initial');
let text = 'text123'
render(
    <div>123123
        <div class={'123'}>
            {text}
        </div>
        <First haha={'hahahahah'}></First>
        <input type="text"/>
    </div>,
    document.getElementById('root')
)


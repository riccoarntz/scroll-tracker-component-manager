# scroll-tracker-component-manager


## Installation
### yarn / npm

```sh
yarn add scroll-tracker-component-manager
```

```sh
npm i -S scroll-tracker-component-manager
```

## Usage
The ScrollTrackerComponentManager is a class that tracks whether a component is within your viewport based on your 
window scroll position. Once a component is in/out your viewport it will trigger methods on the component such as 
'enterView' or 'leaveView'.
 
#### Constructing and adding components.
```
  const components = [new DummyFoo(), new DummyFoo2()];
  const scrollTrackerComponentManager = new ScrollTrackerComponentManager();
 
  scrollTrackerComponentManager.addComponentsToScrollTracker(components);
```

#### Configuration - IScrollTrackerComponentManagerOptions. 
Methods/properties of the component that are triggered which can be overwritten to add components with a 
different/custom interface.
```
  const scrollTrackerComponentManager = new ScrollTrackerComponentManager({
      element: 'myComponentElement',
      methods: {
        enterView: 'myEnterViewMethod',
        leaveView: 'myLeaveViewMethod',
        beyondView: 'myBeyondViewMethod',
      },
      vars: {
        enterViewThreshold: 'enterViewThreshold',
        componentId: 'myComponentId',
        hasEntered: 'myHasEntered'
      },
      config: {
        setDebugLabel: true,
        debugBorderColor: 'red',
        resizeDebounce: 100,
      },
  });
``` 


* element - PropertyName of the component that contains the HTMLElement of the component.
* enterView - MethodName of the component which is triggered when the component is within the 
viewport.
* leaveView - MethodName of the component which is triggered when the component has left the viewport.
* beyondView - MethodName of the component which is triggered everytime it is already scrolled passed a component, or
 when you would load a page while the scrollbar is already at the bottom or passed a component.
* enterViewThreshold - PropertyName of the component that contains a number between 0 - 1. Setting this number to 
for example 0.5 will trigger the enterView method when the component is already visible for 50% within your 
viewport.
* hasEntered - PropertyName of the component that should is by default set to false. Will be set to value if it has 
passed the viewport once already.
* componentId - PropertyName of the component that should contain a unique string for each added component.
* setDebugLabel - Enable/Disable visible scroll-tracker-points for each component, this will allow to you see when the 
transitionIn/Out is called.
* debugBorderColor - Color of the scroll-tracker-points (top/bottom line).
* resizeDebounce -  Number in milliseconds to update the scroll-tracker-points with a debounce if the window is 
being resized.


#### Removing components from the scrollTrackerComponentManager
```
  scrollTrackerComponentManager.removeComponentsFromScrollTracker(components);
```

#### Disposing scrollTrackerComponentManager
```
  scrollTrackerComponentManager.dipose();
```  


## Building

In order to build scroll-tracker-component-manager, ensure that you have [Git](http://git-scm.com/downloads) and [Node.js](http://nodejs.org/) installed.

Clone a copy of the repo:
```sh
git clone https://github.com/riccomediamonks/scroll-tracker-component-manager.git
```

Change to the scroll-tracker-component-manager directory:
```sh
cd scroll-tracker-component-manager
```

Install dev dependencies:
```sh
yarn
```

Use one of the following main scripts:
```sh
yarn build           # build this project
yarn dev             # run dev-watch mode, serving example/index.html in the browser
yarn generate        # generate all artifacts (compiles ts, webpack, docs and coverage)
yarn test:unit       # run the unit tests
yarn validate        # runs validation scripts, including test, lint and coverage check
yarn lint            # run tslint on this project
yarn doc             # generate typedoc documentation
```

When installing this module, it adds a pre-push hook, that runs the `validate`
script before committing, so you can be sure that everything checks out.

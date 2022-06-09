# schema-differ-show
a vue project what is show the differences between an existing object and  the other object. And give the describe by JSON schema


````
<SchemaDifferShow
    :currentJSON="currentJSON"
    :differJSON="differJSON"
    :hasChildren="hasChildren"
    :currentChildren="currentChildren"
    :differChildren="differChildren"
    :schema="schema"
    :isShowDiffer="isShowDiffer"
/>
````

# currentJSON
当前需要展示的JSON对象或数组

# differJSON
需要跟currentJSON进行对比的对象或数组

# hasChildren
是否包含子项
子项决定currentJSON 和 currentJSON是对象还是数组
对象即为单一表单
数组即为复合表单

# currentChildren
当前 currentJSON 对应的 children集合 为简单数组例如
[1,2,3,4,5]

# differChildren
当前 differJSON 对应的 children集合 为简单数组例如
[1,2,3,4,5]

# schema
对两个currentJSON的描述

# isShowDiffer
是否显示diff内容
否则是currentJSON展示内容

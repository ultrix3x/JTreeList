# TreeList
TreeList is an implementation of a binaty tree combined with a double linked
list. You can easily build an hierarchy of your objects or arrays on a specified
index.

## Class TTreeList
### properties
#### root              The root node of the tree
#### first             The first node of the double linked list
#### last              The last node of the double linked list
#### treeCount         The number of nodes in the tree and double linked list
#### isDirty           Set if a node has been added since the last build

### functions
#### add               Add a new node to the tree/double linked list
#### count             The number of nodes in the raw tree (includes nodes with duplicate values)
#### search            Search for a node by value in the tree
#### addBuildFilter    Add a filter callback that is called when the build function traverses all nodes before building the tree/list
#### clearBuildFilters Remove all build filters
#### build             Build a tree and a double linked list

## Class TTreeListNode
### properties
#### prev              A pointer to the previous node in the double linked list
#### left              A pointer to the left node in the tree
#### parent            A pointer to the parent node in the tree
#### right             A pointer to the right node in the tree
#### next              A pointer to the next node in the double linked list

### functions
#### addPayload        Add a node from the TTreeList. If the value is a duplicate then it is added as well
#### getPayloadCount   Return the number of payloads this node holds
#### setPayloadIndex   Set the index for which payload should return a value with the get function
#### get               Return the value of the given index from the active payload




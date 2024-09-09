# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### DnssecRecordStruct <a name="DnssecRecordStruct" id="@gemeentenijmegen/dnssec-record.DnssecRecordStruct"></a>

#### Initializers <a name="Initializers" id="@gemeentenijmegen/dnssec-record.DnssecRecordStruct.Initializer"></a>

```typescript
import { DnssecRecordStruct } from '@gemeentenijmegen/dnssec-record'

new DnssecRecordStruct(scope: Construct, id: string, props: DnssecRecordStructProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@gemeentenijmegen/dnssec-record.DnssecRecordStruct.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@gemeentenijmegen/dnssec-record.DnssecRecordStruct.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@gemeentenijmegen/dnssec-record.DnssecRecordStruct.Initializer.parameter.props">props</a></code> | <code><a href="#@gemeentenijmegen/dnssec-record.DnssecRecordStructProps">DnssecRecordStructProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@gemeentenijmegen/dnssec-record.DnssecRecordStruct.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@gemeentenijmegen/dnssec-record.DnssecRecordStruct.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@gemeentenijmegen/dnssec-record.DnssecRecordStruct.Initializer.parameter.props"></a>

- *Type:* <a href="#@gemeentenijmegen/dnssec-record.DnssecRecordStructProps">DnssecRecordStructProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@gemeentenijmegen/dnssec-record.DnssecRecordStruct.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@gemeentenijmegen/dnssec-record.DnssecRecordStruct.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@gemeentenijmegen/dnssec-record.DnssecRecordStruct.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@gemeentenijmegen/dnssec-record.DnssecRecordStruct.isConstruct"></a>

```typescript
import { DnssecRecordStruct } from '@gemeentenijmegen/dnssec-record'

DnssecRecordStruct.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@gemeentenijmegen/dnssec-record.DnssecRecordStruct.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@gemeentenijmegen/dnssec-record.DnssecRecordStruct.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="@gemeentenijmegen/dnssec-record.DnssecRecordStruct.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


## Structs <a name="Structs" id="Structs"></a>

### DnssecRecordStructProps <a name="DnssecRecordStructProps" id="@gemeentenijmegen/dnssec-record.DnssecRecordStructProps"></a>

#### Initializer <a name="Initializer" id="@gemeentenijmegen/dnssec-record.DnssecRecordStructProps.Initializer"></a>

```typescript
import { DnssecRecordStructProps } from '@gemeentenijmegen/dnssec-record'

const dnssecRecordStructProps: DnssecRecordStructProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@gemeentenijmegen/dnssec-record.DnssecRecordStructProps.property.hostedZone">hostedZone</a></code> | <code>aws-cdk-lib.aws_route53.IHostedZone</code> | *No description.* |
| <code><a href="#@gemeentenijmegen/dnssec-record.DnssecRecordStructProps.property.keySigningKey">keySigningKey</a></code> | <code>aws-cdk-lib.aws_route53.CfnKeySigningKey</code> | *No description.* |
| <code><a href="#@gemeentenijmegen/dnssec-record.DnssecRecordStructProps.property.parentHostedZone">parentHostedZone</a></code> | <code>aws-cdk-lib.aws_route53.IHostedZone</code> | *No description.* |
| <code><a href="#@gemeentenijmegen/dnssec-record.DnssecRecordStructProps.property.forceUpdate">forceUpdate</a></code> | <code>string</code> | Force update Pass a random string to trigger an update in this custom resource. |
| <code><a href="#@gemeentenijmegen/dnssec-record.DnssecRecordStructProps.property.roleToAssume">roleToAssume</a></code> | <code>string</code> | Set a role to assume for creating the DNSSEC record Can be used for cross account DS record creation. |

---

##### `hostedZone`<sup>Required</sup> <a name="hostedZone" id="@gemeentenijmegen/dnssec-record.DnssecRecordStructProps.property.hostedZone"></a>

```typescript
public readonly hostedZone: IHostedZone;
```

- *Type:* aws-cdk-lib.aws_route53.IHostedZone

---

##### `keySigningKey`<sup>Required</sup> <a name="keySigningKey" id="@gemeentenijmegen/dnssec-record.DnssecRecordStructProps.property.keySigningKey"></a>

```typescript
public readonly keySigningKey: CfnKeySigningKey;
```

- *Type:* aws-cdk-lib.aws_route53.CfnKeySigningKey

---

##### `parentHostedZone`<sup>Required</sup> <a name="parentHostedZone" id="@gemeentenijmegen/dnssec-record.DnssecRecordStructProps.property.parentHostedZone"></a>

```typescript
public readonly parentHostedZone: IHostedZone;
```

- *Type:* aws-cdk-lib.aws_route53.IHostedZone

---

##### `forceUpdate`<sup>Optional</sup> <a name="forceUpdate" id="@gemeentenijmegen/dnssec-record.DnssecRecordStructProps.property.forceUpdate"></a>

```typescript
public readonly forceUpdate: string;
```

- *Type:* string

Force update Pass a random string to trigger an update in this custom resource.

---

##### `roleToAssume`<sup>Optional</sup> <a name="roleToAssume" id="@gemeentenijmegen/dnssec-record.DnssecRecordStructProps.property.roleToAssume"></a>

```typescript
public readonly roleToAssume: string;
```

- *Type:* string

Set a role to assume for creating the DNSSEC record Can be used for cross account DS record creation.

---




import { trpc } from './tprc'
import React, { useEffect, useState } from 'react'
import './App.css'
import { faker } from '@faker-js/faker'
import { Widget } from '../../common'

function App() {
  const [widgets, setWidgets] = useState<Widget[]>([])

  useEffect(() => {
    trpc.onCreate.subscribe(undefined, {
      onData: (data) => {
        setWidgets((widgets) => [...widgets, data])
      },
      onError: (err) => {
        console.error('subscribe error', err)
      }
    })
  }, [])

  return (
    <div className="App">
      <header className="App-header">Widgets</header>

      <button
        onClick={() => {
          trpc.create.mutate({ name: faker.commerce.productName() })
        }}
      >
        Create Widget
      </button>

      <hr />

      <ul>
        {widgets.map((widget) => (
          <li key={widget.id}>{widget.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default App

import { describe, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import Payment from './index'
import userEvent from "@testing-library/user-event";


const DATA_BAG = {
  id: 'teste',
  items: [],
  subTotal: 'R$ 100,00',
  shippingTotal: 'R$ 5,00',
  discount: 'R$ 20,00',
  total: 'R$ 120,00',
  totalItens: 2
}
const MOCK_NEXT_STEP = vi.fn()
const MOCK_UPDATE_PAYE = vi.fn()

describe('Tests of Payment', () => {
  it('Should show card of ipunt payment', () => {
    render(<Payment dataBag={DATA_BAG} nextStep={MOCK_NEXT_STEP} updatDataPayment={MOCK_UPDATE_PAYE} />)
    expect(screen.getByText(/Cartâo de Crédito/i)).toBeVisible()
  })
  it('Should show card of info prices', () => {
    render(<Payment dataBag={DATA_BAG} nextStep={MOCK_NEXT_STEP} updatDataPayment={MOCK_UPDATE_PAYE} />)
    expect(screen.getByText(/Finalizar pedido/i)).toBeVisible()
    expect(screen.getByText(DATA_BAG.subTotal)).toBeVisible()

  })
  it('Should render params of info prices card', () => {
    render(<Payment dataBag={DATA_BAG} nextStep={MOCK_NEXT_STEP} updatDataPayment={MOCK_UPDATE_PAYE} />)
    expect(screen.getByText(DATA_BAG.subTotal)).toBeVisible()
    expect(screen.getByText(DATA_BAG.shippingTotal)).toBeVisible()
    expect(screen.getByText(DATA_BAG.total)).toBeVisible()
    expect(screen.getByText(DATA_BAG.discount)).toBeVisible()
    expect(screen.getByText(`Produtos: (${DATA_BAG.totalItens}) itens`)).toBeVisible()
  })

  it.skip('Should messages error when click in button and fields are empty', async () => {
    const mockNextStep = vi.fn()
    render(
      <div>
          <Payment dataBag={DATA_BAG} nextStep={mockNextStep} updatDataPayment={MOCK_UPDATE_PAYE} />
      </div>
    )
    await act(async () => {
      userEvent.type(screen.getByRole('textbox', {
        name: /número/i
      }), '123412341234')
      userEvent.type(screen.getByRole('textbox', {
        name: /nome do titular do cartão/i
      }), 'Nome')
      userEvent.type(screen.getByRole('textbox', {
        name: /data de validade/i
      }), '12/2029')
      userEvent.type(screen.getByRole('textbox', {
        name: /código cvv:/i
      }), '123')
      userEvent.click(screen.getByText(/Finalizar pedido/i))
    })
    expect(MOCK_UPDATE_PAYE).toBeCalledTimes(1)
    expect(await screen.findAllByText(/número de cartão válido/i))[0].toBeVisible()
    expect(screen.getByText(/insira um nome válido/i)).toBeVisible()
    expect(screen.getByText(/insira uma data válida/i)).toBeVisible()
    expect(screen.getByText(/insira um cvv válido/i)).toBeVisible()

  })
})
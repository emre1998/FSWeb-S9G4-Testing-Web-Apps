import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import IletisimFormu from './IletisimFormu';

test('hata olmadan render ediliyor', () => {
    //Arrange//
    render(<IletisimFormu/>);
});

test('iletişim formu headerı render ediliyor', () => {
render(<IletisimFormu/>);
const headerElement = screen.getByRole('heading',{name: "İletişim Formu" });
expect(headerElement).toBeInTheDocument();
});

test('kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.', async () => {
render(<IletisimFormu/>);
const adInput= screen.getAllByLabelText(/ad/i);
userEvent.type(adInput, 'İlhan');
const submitButton = screen.getByRole('button',{name: /gönder/i});
userEvent.click(submitButton);

await waitFor(()=> {
    const errorMessage =screen.getByText(/ad en az 5 karakter olmalıdır/i);
    expect(errorMessage).toBeInTheDocument();
});

});

test('kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.', async () => {
render(<IletisimFormu/>);
const submitButton = screen.getByRole('button',{name:/gönder/i});
userEvent.click(submitButton);

await waitFor(()=> {
    const errorMessage= screen.getAllByTestId('error');
    expect(errorMessage.length).toBe(3);
});
});

test('kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.', async () => {
render(<IletisimFormu/>);
const adInput = screen.getAllByLabelText(/ad/i);
const soyadInput = screen.getAllByLabelText(/soyad/i);
userEvent.type(adInput,'İlhan');
userEvent.type(soyadInput,'Mansız');
const submitButton= screen.getByRole('button',{name:/gönder/i});
userEvent.click(submitButton);

await waitFor(()=> {
    const errorMessage = screen.getByText(/email geçerli bir email adresi olmalıdır./i);
    expect(errorMessage).toBeInTheDocument();
});
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
    render(<IletisimFormu/>);
    const emailInput = screen.getByLabelText(/email/i);
    userEvent.type(emailInput,'invalid_email');
    const submitButton = screen.getByRole('button',{name: /gönder/i});
    userEvent.click(submitButton);

    await waitFor(()=>{
        const errorMessage = screen.getByText(/email geçerli bir email adresi olmalıdır/i);
        expect(errorMessage).toBeInTheDocument();
    });
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
render(<IletisimFormu/>);
const submitButton = screen.getByRole('button',{name:/gönder/i});
userEvent.click(submitButton);

await waitFor(()=>{
    const errorMessage = screen.getByText(/soyad gereklidir/i);
    expect(errorMessage).toBeInTheDocument();
    });
});

test('ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.', async () => {
render(<IletisimFormu/>);
const adInput = screen.getAllByLabelText(/Ad/i);
const soyadInput = screen.getAllByLabelText(/Soyad/i);
const emailInput = screen.getAllByLabelText(/Email/i);
userEvent.type(adInput,'İlhan');
userEvent.type(soyadInput,'Mansız');
userEvent.type(emailInput,'yuzyilingolcusu@hotmail.com');
const submitButton= screen.getByRole('button',{name:/gönder/i});
userEvent.click(submitButton);

await waitFor(() => {
    const errorMessage = screen.queryByText(/mesaj eklemelisiniz/i, { selector: 'span' });
    expect(errorMessage).not.toBeInTheDocument();
  })
});

test('form gönderildiğinde girilen tüm değerler render ediliyor.', async () => {
    render(<IletisimFormu/>);
    const adInput = screen.getAllByLabelText(/ad/i);
    const soyadInput = screen.getAllByLabelText(/soyad/i);
    const emailInput = screen.getAllByLabelText(/email/i); 
    userEvent.type(adInput,'İlhan');
    userEvent.type(soyadInput,'Mansız');
    userEvent.type(emailInput,"yüzyılıngolcüsü@hotmail.com");
    const submitButton= screen.getByRole('button',{name:/gönder/i});
    userEvent.click(submitButton);


    await waitFor(() => {
        expect(screen.getByPlaceholderText("İlhan")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Mansız")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com")).toBeInTheDocument()
      });

});


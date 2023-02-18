document.addEventListener('DOMContentLoaded', () => {
  // LOCAL STORAGE SECTION --------------------------------------------------------------------------
  function storageCheck() {
    return typeof Storage !== 'undefined';
  }

  const RENDER_SEMUA_BUKU = 'render_semua_buku';
  const RENDER_SUDAH_DIBACA = 'render_sudah_dibaca';
  const RENDER_BELUM_DIBACA = 'render_belum_dibaca';

  let books = [];
  let menuCount = 1;
  let setting = [
    {
      stg: 1,
      state: false,
    },
    {
      stg: 2,
      state: false,
    },
  ];

  document.addEventListener(RENDER_SEMUA_BUKU, () => {
    if (localStorage.getItem(strgKey) !== null) {
      books = JSON.parse(localStorage.getItem(strgKey));
    }
    const halamanSemuaBuku = document.querySelector('#semuaBuku .container');
    halamanSemuaBuku.innerHTML = '';

    for (const book of books) {
      const bookObject = cardConstructor(book);
      halamanSemuaBuku.appendChild(bookObject);
    }
  });
  document.addEventListener(RENDER_SUDAH_DIBACA, () => {
    if (localStorage.getItem(strgKey) !== null) {
      books = JSON.parse(localStorage.getItem(strgKey));
    }
    const halamanSudahDibaca = document.querySelector('#sudahDibaca .container');
    halamanSudahDibaca.innerHTML = '';

    for (const book of books) {
      if (book.isRead == true) {
        const bookObject = cardConstructor(book);
        halamanSudahDibaca.appendChild(bookObject);
      }
    }
  });
  document.addEventListener(RENDER_BELUM_DIBACA, () => {
    if (localStorage.getItem(strgKey) !== null) {
      books = JSON.parse(localStorage.getItem(strgKey));
    }
    const halamanBelumDibaca = document.querySelector('#belumDibaca .container');
    halamanBelumDibaca.innerHTML = '';

    for (const book of books) {
      if (book.isRead == false) {
        const bookObject = cardConstructor(book);
        halamanBelumDibaca.appendChild(bookObject);
      }
    }
  });

  const strgKey = 'BOOK_LIST';
  const sttgKey = 'SETTINGS';
  const submitDataAction = document.getElementById('formBukuBaru');

  // deklarasi variabel
  const kolomMenu = document.getElementById('menu');
  const menu = document.querySelectorAll('.group');
  const menuKonten = document.querySelectorAll('.menu-konten');
  const menuTambahBuku = document.querySelector('.tambah-buku');
  const btnPengaturan = document.getElementById('tombolPengaturan');
  const tabPengaturan = document.getElementById('pengaturan');
  const kolomPencarian = document.getElementById('cariBuku');
  const hamburgerMenu = document.getElementById('hambMenu');
  const windowPeringatan = document.getElementById('peringatan');
  const yesBtn = document.getElementById('yes');
  const noBtn = document.getElementById('no');

  // default menu awal
  menu.forEach((element, i) => {
    if (element.classList.contains('active')) {
      menuKonten[i + 1].removeAttribute('hidden');
    }
  });

  hamburgerMenu.addEventListener('click', () => {
    kolomMenu.classList.add('menu-aktif');
  });

  // pilih menu
  menu.forEach((element, i) => {
    element.addEventListener('click', () => {
      menuKonten.forEach((element) => {
        element.setAttribute('hidden', true);
      });
      menu.forEach((element) => {
        element.classList.remove('active');
      });

      menuKonten[i + 1].removeAttribute('hidden');

      element.classList.add('active');
      kolomMenu.classList.remove('menu-aktif');

      if (i + 1 == 1) {
        menuCount = 1;
        document.dispatchEvent(new Event(RENDER_SEMUA_BUKU));
      }
      if (i + 1 == 2) {
        menuCount = 2;
        document.dispatchEvent(new Event(RENDER_SUDAH_DIBACA));
      }
      if (i + 1 == 3) {
        menuCount = 3;
        document.dispatchEvent(new Event(RENDER_BELUM_DIBACA));
      }
    });
  });

  // ubah pengaturan
  const STTG_notifikasiAksi = document.querySelectorAll('.wrapper')[0];
  const STTG_peringatanHapus = document.querySelectorAll('.wrapper')[1];
  const wadahTombol1 = document.querySelectorAll('.switch')[0];
  const tombol1 = document.querySelectorAll('.toggle')[0];
  const wadahTombol2 = document.querySelectorAll('.switch')[1];
  const tombol2 = document.querySelectorAll('.toggle')[1];
  const clearData = document.getElementById('clearDataBtn');

  if (localStorage.getItem(sttgKey) !== null) {
    const currentSetting = JSON.parse(localStorage.getItem(sttgKey));
    setting = currentSetting;
  }
  if (setting[0].state == true) {
    tombol1.classList.add('toggle-aktif');
    wadahTombol1.classList.add('switch-aktif');
  } else {
    tombol1.classList.remove('toggle-aktif');
    wadahTombol1.classList.remove('switch-aktif');
  }
  if (setting[1].state == true) {
    tombol2.classList.add('toggle-aktif');
    wadahTombol2.classList.add('switch-aktif');
  } else {
    tombol2.classList.remove('toggle-aktif');
    wadahTombol2.classList.remove('switch-aktif');
  }

  STTG_notifikasiAksi.addEventListener('click', () => {
    tombol1.classList.toggle('toggle-aktif');
    wadahTombol1.classList.toggle('switch-aktif');

    if (wadahTombol1.classList.contains('switch-aktif')) {
      setting[0].state = true;
      saveSettings();
    } else {
      setting[0].state = false;
      saveSettings();
    }

    console.log(setting);
  });

  STTG_peringatanHapus.addEventListener('click', () => {
    tombol2.classList.toggle('toggle-aktif');
    wadahTombol2.classList.toggle('switch-aktif');

    if (wadahTombol2.classList.contains('switch-aktif')) {
      setting[1].state = true;
      saveSettings();
    } else {
      setting[1].state = false;
      saveSettings();
    }

    console.log(setting);
  });

  // menu tambah buku baru
  menuTambahBuku.addEventListener('click', () => {
    const btnSimpan = document.getElementById('submitBtn');
    const btnUbah = document.getElementById('submitChangeBtn');
    const halamanForm = document.getElementById('formTambahEdit');
    const inputNamaBuku = document.getElementById('formNamaBuku');
    const inputPenulis = document.getElementById('formPenulisBuku');
    const inputTanggalTerbit = document.getElementById('formTanggalTerbit');
    const inputSudahDibaca = document.getElementById('cbSudahDibaca');

    menuKonten.forEach((element) => {
      element.setAttribute('hidden', true);
    });
    menu.forEach((element) => {
      element.classList.remove('active');
    });

    kolomMenu.classList.remove('menu-aktif');

    menuKonten[0].removeAttribute('hidden');
    halamanForm.innerHTML = 'Tambah Buku';
    btnSimpan.removeAttribute('hidden');
    btnUbah.setAttribute('hidden', true);

    inputNamaBuku.value = '';
    inputPenulis.value = '';
    inputTanggalTerbit.value = '';
    inputSudahDibaca.checked = false;
  });

  btnPengaturan.addEventListener('click', () => {
    tabPengaturan.classList.toggle('show');
  });

  menuKonten.forEach((element, i) => {
    if (!element.hasAttribute('hidden')) {
      document.dispatchEvent(new Event(RENDER_SEMUA_BUKU));
    }
  });

  submitDataAction.addEventListener('submit', (event) => {
    const inputNamaBuku = document.getElementById('formNamaBuku');
    const inputPenulis = document.getElementById('formPenulisBuku');
    const inputTanggalTerbit = document.getElementById('formTanggalTerbit');
    const inputSudahDibaca = document.getElementById('cbSudahDibaca');
    const bookData = {
      id: generateID(),
      title: inputNamaBuku.value,
      author: inputPenulis.value,
      publish: inputTanggalTerbit.value,
      isRead: inputSudahDibaca.checked,
    };

    function generateID() {
      return +new Date();
    }

    saveBookData(bookData);
    if (setting[0].state == true) {
      notifikasiAksi('Buku baru berhasil ditambahkan!');
    }

    event.preventDefault();
    inputNamaBuku.value = '';
    inputPenulis.value = '';
    inputTanggalTerbit.value = '';
    inputSudahDibaca.checked = false;
  });

  function saveBookData(data) {
    if (storageCheck()) {
      if (localStorage.getItem(strgKey) !== null) {
        books = JSON.parse(localStorage.getItem(strgKey));
      }
      books.unshift(data);

      localStorage.setItem(strgKey, JSON.stringify(books));
    }
  }

  function saveSettings() {
    if (storageCheck()) {
      localStorage.setItem(sttgKey, JSON.stringify(setting));
    }
  }

  function cardConstructor(bookData) {
    const halamanForm = document.getElementById('formTambahEdit');
    const inputNamaBuku = document.getElementById('formNamaBuku');
    const inputPenulis = document.getElementById('formPenulisBuku');
    const inputTanggalTerbit = document.getElementById('formTanggalTerbit');
    const inputSudahDibaca = document.getElementById('cbSudahDibaca');

    const cardJudulBuku = document.createElement('h3');
    cardJudulBuku.innerHTML = bookData.title;
    cardJudulBuku.setAttribute('id', 'cardJudulBuku');
    const cardIDBuku = document.createElement('h4');
    cardIDBuku.innerHTML = `ID: ${bookData.id}`;
    cardIDBuku.setAttribute('id', 'cardIDBuku');
    const cardPenulisBuku = document.createElement('h4');
    cardPenulisBuku.innerHTML = `Penulis: ${bookData.author}`;
    cardPenulisBuku.setAttribute('id', 'cardPenulisBuku');
    const cardTahunTerbit = document.createElement('h5');
    cardTahunTerbit.innerHTML = `Tahun terbit: ${bookData.publish}`;
    cardTahunTerbit.setAttribute('id', 'cardTahunTerbit');

    const cardEdit = document.createElement('i');
    cardEdit.classList.add('bi', 'bi-pencil-square');
    const cardStatus = document.createElement('p');
    cardStatus.setAttribute('id', 'status');
    const cardStatusBtn = document.createElement('button');
    cardStatusBtn.setAttribute('id', 'statusBtn');
    const cardEraseBtn = document.createElement('button');
    cardEraseBtn.setAttribute('id', 'eraseBtn');
    const eraseIcon = document.createElement('i');
    eraseIcon.classList.add('bi', 'bi-trash-fill');
    if (bookData.isRead !== true) {
      cardStatus.innerHTML = 'Belum Dibaca';

      cardStatusBtn.innerHTML = 'Tandai Sudah Dibaca';
      cardStatusBtn.classList.add('read');

      cardStatusBtn.addEventListener('click', () => {
        tandaiSudahDibaca(bookData.id);

        if (menuCount == 1) {
          document.dispatchEvent(new Event(RENDER_SEMUA_BUKU));
        }
        if (menuCount == 2) {
          document.dispatchEvent(new Event(RENDER_SUDAH_DIBACA));
        }
        if (menuCount == 3) {
          document.dispatchEvent(new Event(RENDER_BELUM_DIBACA));
        }

        if (setting[0].state == true) {
          notifikasiAksi(`Selamat! Buku dengan ID ${bookData.id} Sudah Berhasil Dibaca`);
        }
      });
    } else {
      cardStatus.innerHTML = 'Sudah Dibaca';

      cardStatusBtn.innerHTML = 'Tandai Belum Dibaca';
      cardStatusBtn.classList.add('unread');

      cardStatusBtn.addEventListener('click', () => {
        tandaiBelumDibaca(bookData.id);

        if (menuCount == 1) {
          document.dispatchEvent(new Event(RENDER_SEMUA_BUKU));
        }
        if (menuCount == 2) {
          document.dispatchEvent(new Event(RENDER_SUDAH_DIBACA));
        }
        if (menuCount == 3) {
          document.dispatchEvent(new Event(RENDER_BELUM_DIBACA));
        }

        if (setting[0].state == true) {
          notifikasiAksi(`Status Buku dengan ID ${bookData.id} Diubah ke Belum Dibaca!`);
        }
      });
    }

    cardEraseBtn.addEventListener('click', () => {
      if (setting[1].state == true) {
        peringatanHapus(bookData.id);
      } else {
        hapusBuku(bookData.id);

        if (menuCount == 1) {
          document.dispatchEvent(new Event(RENDER_SEMUA_BUKU));
        }
        if (menuCount == 2) {
          document.dispatchEvent(new Event(RENDER_SUDAH_DIBACA));
        }
        if (menuCount == 3) {
          document.dispatchEvent(new Event(RENDER_BELUM_DIBACA));
        }
      }
    });

    cardEdit.addEventListener('click', () => {
      const btnSimpan = document.getElementById('submitBtn');
      const btnUbah = document.getElementById('submitChangeBtn');

      const targetBuku = cariBuku(bookData.id);

      menuKonten.forEach((element) => {
        element.setAttribute('hidden', true);
      });
      menu.forEach((element) => {
        element.classList.remove('active');
      });

      menuKonten[0].removeAttribute('hidden');
      halamanForm.innerHTML = 'Edit Buku';
      btnUbah.removeAttribute('hidden');
      btnSimpan.setAttribute('hidden', true);

      inputNamaBuku.value = bookData.title;
      inputPenulis.value = bookData.author;
      inputTanggalTerbit.value = bookData.publish;
      inputSudahDibaca.checked = bookData.isRead;

      btnUbah.addEventListener('click', () => {
        targetBuku.title = inputNamaBuku.value;
        targetBuku.author = inputPenulis.value;
        targetBuku.publish = inputTanggalTerbit.value;
        targetBuku.isRead = inputSudahDibaca.checked;
        simpanDataBuku();

        if (setting[0].state == true) {
          notifikasiAksi('Data Buku Berhasil Diubah!');
        }
      });
    });

    if (menuCount == 2 || menuCount == 3) {
      cardStatus.classList.add('hide-status');
    } else {
      cardStatus.classList.remove('hide-status');
    }

    const cardCol1 = document.createElement('div');
    cardCol1.classList.add('col1');
    const cardCol2 = document.createElement('div');
    cardCol2.classList.add('col2');

    const cardRow1 = document.createElement('div');
    cardRow1.classList.add('card-row1');
    const cardRow2 = document.createElement('div');
    cardRow2.classList.add('card-row2');
    const card = document.createElement('div');
    card.classList.add('card');

    cardCol1.appendChild(cardJudulBuku);
    cardCol1.appendChild(cardIDBuku);
    cardCol1.appendChild(cardPenulisBuku);
    cardCol1.appendChild(cardTahunTerbit);

    cardCol2.appendChild(cardEdit);
    cardCol2.appendChild(cardStatus);

    cardEraseBtn.appendChild(eraseIcon);

    cardRow1.appendChild(cardCol1);
    cardRow1.appendChild(cardCol2);
    cardRow2.appendChild(cardStatusBtn);
    cardRow2.appendChild(cardEraseBtn);

    card.appendChild(cardRow1);
    card.appendChild(cardRow2);

    return card;
  }

  function tandaiSudahDibaca(bookID) {
    const targetBuku = cariBuku(bookID);

    if (targetBuku == null) return;

    targetBuku.isRead = true;
    simpanDataBuku();
  }

  function tandaiBelumDibaca(bookID) {
    const targetBuku = cariBuku(bookID);

    if (targetBuku == null) return;

    targetBuku.isRead = false;
    simpanDataBuku();
  }

  function hapusBuku(bookID) {
    const targetBuku = cariBuku(bookID);

    if (targetBuku == -1) return;

    books.splice(targetBuku, 1);
    simpanDataBuku();
  }

  function cariBuku(bookID) {
    for (const book of books) {
      if (book.id === bookID) {
        return book;
      }
    }
  }

  function simpanDataBuku() {
    const dataBaru = JSON.stringify(books);
    localStorage.setItem(strgKey, dataBaru);
  }

  function notifikasiAksi(teks) {
    const kolomNotif = document.getElementById('notifikasi');
    const notif = document.createElement('p');
    notif.setAttribute('id', 'teksNotifikasi');
    notif.classList.add('notifikasi-nonaktif');
    notif.innerHTML = teks;
    kolomNotif.append(notif);
    setTimeout(() => {
      notif.classList.add('notifikasi-aktif');
    }, 0);

    setTimeout(() => {
      notif.classList.remove('notifikasi-aktif');
      setTimeout(() => {
        notif.remove();
      }, 200);
    }, 2000);
  }

  kolomPencarian.addEventListener('focus', () => {
    hamburgerMenu.style.display = 'none';
  });

  kolomPencarian.addEventListener('blur', () => {
    hamburgerMenu.style.display = 'block';
  });

  kolomPencarian.addEventListener('input', () => {
    menuKonten.forEach((element) => {
      element.setAttribute('hidden', true);
    });
    menu.forEach((element) => {
      element.classList.remove('active');
    });

    menuKonten[4].removeAttribute('hidden');

    const halamanHasilPencarian = document.querySelector('#hasilPencarian .container');
    halamanHasilPencarian.innerHTML = '';

    const inputLength = kolomPencarian.value.length;

    menuCount = 4;

    if (inputLength !== 0) {
      for (const book of books) {
        if (book.title.slice(0, inputLength).toLowerCase() == kolomPencarian.value.toLowerCase()) {
          const bookObject = cardConstructor(book);
          halamanHasilPencarian.append(bookObject);
        }
      }
    }
  });

  function peringatanHapus(bookID) {
    windowPeringatan.style.display = 'flex';

    yesBtn.addEventListener('click', () => {
      hapusBuku(bookID);

      if (menuCount == 1) {
        windowPeringatan.style.display = 'none';
        notifikasiAksi('Buku Berhasil Dihapus!');
        document.dispatchEvent(new Event(RENDER_SEMUA_BUKU));
      }
      if (menuCount == 2) {
        windowPeringatan.style.display = 'none';
        notifikasiAksi('Buku Berhasil Dihapus!');
        document.dispatchEvent(new Event(RENDER_SUDAH_DIBACA));
      }
      if (menuCount == 3) {
        windowPeringatan.style.display = 'none';
        notifikasiAksi('Buku Berhasil Dihapus!');
        document.dispatchEvent(new Event(RENDER_BELUM_DIBACA));
      }
    });

    noBtn.addEventListener('click', () => {
      windowPeringatan.style.display = 'none';
    });
  }

  function peringatanClearData() {
    windowPeringatan.style.display = 'flex';

    yesBtn.addEventListener('click', () => {
      books = [];
      localStorage.setItem(strgKey, JSON.stringify(books));

      if (menuCount == 1) {
        windowPeringatan.style.display = 'none';
        notifikasiAksi('Semua Data Buku Berhasil Dihapus!');
        document.dispatchEvent(new Event(RENDER_SEMUA_BUKU));
      }
      if (menuCount == 2) {
        windowPeringatan.style.display = 'none';
        notifikasiAksi('Semua Data Buku Berhasil Dihapus!');
        document.dispatchEvent(new Event(RENDER_SUDAH_DIBACA));
      }
      if (menuCount == 3) {
        windowPeringatan.style.display = 'none';
        notifikasiAksi('Semua Data Buku Berhasil Dihapus!');
        document.dispatchEvent(new Event(RENDER_BELUM_DIBACA));
      }
    });

    noBtn.addEventListener('click', () => {
      windowPeringatan.style.display = 'none';
    });
  }

  clearData.addEventListener('click', () => {
    if (storageCheck) {
      if (JSON.parse(localStorage.getItem(strgKey)).length !== 0) {
        peringatanClearData();
      } else {
        notifikasiAksi('Anda belum memiliki data Buku apapun!');
      }
    }
  });
});

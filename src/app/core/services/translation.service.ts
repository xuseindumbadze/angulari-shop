import { Injectable, signal } from '@angular/core';

export type SupportedLang = 'en' | 'ka' | 'ru' | 'de' | 'fr' | 'tr';

export const LANGUAGES: { code: SupportedLang; label: string; name: string }[] = [
  { code: 'en', label: '🇬🇧', name: 'English' },
  { code: 'ka', label: '🇬🇪', name: 'ქართული' },
  { code: 'ru', label: '🇷🇺', name: 'Русский' },
  { code: 'de', label: '🇩🇪', name: 'Deutsch' },
  { code: 'fr', label: '🇫🇷', name: 'Français' },
  { code: 'tr', label: '🇹🇷', name: 'Türkçe' },
];

export const TRANSLATIONS: Record<string, Record<SupportedLang, string>> = {
  // HEADER
  'Search products...': { en: 'Search products...', ka: 'პროდუქტების ძიება...', ru: 'Поиск товаров...', de: 'Produkte suchen...', fr: 'Rechercher...', tr: 'Ürün ara...' },
  'Sign up': { en: 'Sign up', ka: 'რეგისტრაცია', ru: 'Регистрация', de: 'Registrieren', fr: "S'inscrire", tr: 'Kayıt ol' },
  'Log in': { en: 'Log in', ka: 'შესვლა', ru: 'Войти', de: 'Anmelden', fr: 'Connexion', tr: 'Giriş yap' },
  'Sign out': { en: 'Sign out', ka: 'გამოსვლა', ru: 'Выйти', de: 'Abmelden', fr: 'Déconnexion', tr: 'Çıkış yap' },

  // SIGNIN MODAL
  'Sign in': { en: 'Sign in', ka: 'შესვლა', ru: 'Войти', de: 'Anmelden', fr: 'Se connecter', tr: 'Giriş yap' },
  'Signing in...': { en: 'Signing in...', ka: 'მიმდინარეობს...', ru: 'Вход...', de: 'Anmeldung...', fr: 'Connexion...', tr: 'Giriliyor...' },
  'Email': { en: 'Email', ka: 'ელ-ფოსტა', ru: 'Эл. почта', de: 'E-Mail', fr: 'E-mail', tr: 'E-posta' },
  'Password': { en: 'Password', ka: 'პაროლი', ru: 'Пароль', de: 'Passwort', fr: 'Mot de passe', tr: 'Şifre' },
  "Don't have an account?": { en: "Don't have an account?", ka: 'არ გაქვს ანგარიში?', ru: 'Нет аккаунта?', de: 'Kein Konto?', fr: 'Pas de compte?', tr: 'Hesabın yok mu?' },
  'Sign up now': { en: 'Sign up now', ka: 'დარეგისტრირდი', ru: 'Зарегистрироваться', de: 'Jetzt registrieren', fr: "S'inscrire", tr: 'Şimdi kayıt ol' },
  'Your trusted electronics store': { en: 'Your trusted electronics store', ka: 'შენი სანდო ელექტრონიკის მაღაზია', ru: 'Ваш надёжный магазин электроники', de: 'Ihr vertrauenswürdiger Elektronikhändler', fr: 'Votre magasin électronique de confiance', tr: 'Güvenilir elektronik mağazanız' },
  'Please fill in all fields.': { en: 'Please fill in all fields.', ka: 'შეავსე ყველა ველი.', ru: 'Заполните все поля.', de: 'Alle Felder ausfüllen.', fr: 'Remplissez tous les champs.', tr: 'Tüm alanları doldurun.' },
  'Invalid email or password.': { en: 'Invalid email or password.', ka: 'არასწორი ელ-ფოსტა ან პაროლი.', ru: 'Неверный email или пароль.', de: 'Falsche E-Mail oder Passwort.', fr: 'Email ou mot de passe incorrect.', tr: 'Geçersiz e-posta veya şifre.' },
  'Token is empty.': { en: 'Token is empty.', ka: 'ტოკენი ცარიელია.', ru: 'Токен пустой.', de: 'Token ist leer.', fr: 'Le token est vide.', tr: 'Token boş.' },
  'Token is invalid or expired.': { en: 'Token is invalid or expired.', ka: 'ტოკენი არასწორია ან ვადაგასულია.', ru: 'Токен недействителен или устарел.', de: 'Token ungültig oder abgelaufen.', fr: 'Token invalide ou expiré.', tr: 'Token geçersiz veya süresi dolmuş.' },
  'Welcome': { en: 'Welcome', ka: 'მოგესალმებით', ru: 'Добро пожаловать', de: 'Willkommen', fr: 'Bienvenue', tr: 'Hoş geldiniz' },
  'Sign in with Token': { en: 'Sign in with Token', ka: 'ტოკენით შესვლა', ru: 'Войти с токеном', de: 'Mit Token anmelden', fr: 'Connexion avec token', tr: 'Token ile giriş' },
  'Checking...': { en: 'Checking...', ka: 'მოწმდება...', ru: 'Проверка...', de: 'Prüfung...', fr: 'Vérification...', tr: 'Kontrol ediliyor...' },
  'Enter your': { en: 'Enter your', ka: 'შეიყვანე შენი', ru: 'Введите ваш', de: 'Geben Sie Ihren', fr: 'Entrez votre', tr: 'Tokeninizi girin' },
  'to sign in directly.': { en: 'to sign in directly.', ka: 'პირდაპირ შესასვლელად.', ru: 'для прямого входа.', de: 'zur direkten Anmeldung.', fr: 'pour vous connecter directement.', tr: 'doğrudan giriş yapmak için.' },

  // SIGNUP MODAL
  'Create Account': { en: 'Create Account', ka: 'ანგარიშის შექმნა', ru: 'Создать аккаунт', de: 'Konto erstellen', fr: 'Créer un compte', tr: 'Hesap oluştur' },
  'First Name': { en: 'First Name', ka: 'სახელი', ru: 'Имя', de: 'Vorname', fr: 'Prénom', tr: 'Ad' },
  'Last Name': { en: 'Last Name', ka: 'გვარი', ru: 'Фамилия', de: 'Nachname', fr: 'Nom', tr: 'Soyad' },
  'Phone': { en: 'Phone', ka: 'ტელეფონი', ru: 'Телефон', de: 'Telefon', fr: 'Téléphone', tr: 'Telefon' },
  'ZIP Code': { en: 'ZIP Code', ka: 'საფოსტო კოდი', ru: 'Индекс', de: 'PLZ', fr: 'Code postal', tr: 'Posta kodu' },
  'Address': { en: 'Address', ka: 'მისამართი', ru: 'Адрес', de: 'Adresse', fr: 'Adresse', tr: 'Adres' },
  'Age': { en: 'Age', ka: 'ასაკი', ru: 'Возраст', de: 'Alter', fr: 'Âge', tr: 'Yaş' },
  'Male': { en: 'Male', ka: 'მამრობითი', ru: 'Мужской', de: 'Männlich', fr: 'Homme', tr: 'Erkek' },
  'Female': { en: 'Female', ka: 'მდედრობითი', ru: 'Женский', de: 'Weiblich', fr: 'Femme', tr: 'Kadın' },
  'Creating account...': { en: 'Creating account...', ka: 'იქმნება...', ru: 'Создание...', de: 'Wird erstellt...', fr: 'Création...', tr: 'Oluşturuluyor...' },
  'Register': { en: 'Register', ka: 'რეგისტრაცია', ru: 'Зарегистрироваться', de: 'Registrieren', fr: "S'inscrire", tr: 'Kayıt ol' },
  'Already have an account?': { en: 'Already have an account?', ka: 'უკვე გაქვს ანგარიში?', ru: 'Уже есть аккаунт?', de: 'Haben Sie ein Konto?', fr: 'Déjà un compte?', tr: 'Zaten hesabın var mı?' },

  // PRODUCTS PAGE
  'Browse by :': { en: 'Browse by :', ka: 'ფილტრი :', ru: 'Фильтр :', de: 'Filtern :', fr: 'Filtrer :', tr: 'Filtrele :' },
  'Category': { en: 'Category', ka: 'კატეგორია', ru: 'Категория', de: 'Kategorie', fr: 'Catégorie', tr: 'Kategori' },
  'Brand': { en: 'Brand', ka: 'ბრენდი', ru: 'Бренд', de: 'Marke', fr: 'Marque', tr: 'Marka' },
  'Rating': { en: 'Rating', ka: 'რეიტინგი', ru: 'Рейтинг', de: 'Bewertung', fr: 'Note', tr: 'Puan' },
  'Price': { en: 'Price', ka: 'ფასი', ru: 'Цена', de: 'Preis', fr: 'Prix', tr: 'Fiyat' },
  'Only': { en: 'Only', ka: 'მხოლოდ', ru: 'Только', de: 'Nur', fr: 'Seulement', tr: 'Sadece' },
  'And up': { en: 'And up', ka: 'და ზევით', ru: 'И выше', de: 'Und höher', fr: 'Et plus', tr: 'Ve üzeri' },
  'Min:': { en: 'Min:', ka: 'მინ:', ru: 'Мин:', de: 'Min:', fr: 'Min:', tr: 'Min:' },
  'Max:': { en: 'Max:', ka: 'მაქს:', ru: 'Макс:', de: 'Max:', fr: 'Max:', tr: 'Max:' },
  'Min': { en: 'Min', ka: 'მინიმუმი', ru: 'Минимум', de: 'Minimum', fr: 'Minimum', tr: 'Minimum' },
  'Max': { en: 'Max', ka: 'მაქსიმუმი', ru: 'Максимум', de: 'Maximum', fr: 'Maximum', tr: 'Maksimum' },
  'Apply Filter': { en: 'Apply Filter', ka: 'ფილტრის გამოყენება', ru: 'Применить', de: 'Filter anwenden', fr: 'Appliquer', tr: 'Filtrele' },
  'GET ALL': { en: 'GET ALL', ka: 'ყველა', ru: 'ВСЕ', de: 'ALLE', fr: 'TOUT', tr: 'HEPSİ' },
  'Loading products...': { en: 'Loading products...', ka: 'იტვირთება...', ru: 'Загрузка...', de: 'Wird geladen...', fr: 'Chargement...', tr: 'Yükleniyor...' },
  'Failed to load products. Please try again.': { en: 'Failed to load products. Please try again.', ka: 'შეცდომა. სცადე თავიდან.', ru: 'Ошибка загрузки. Попробуйте снова.', de: 'Fehler beim Laden.', fr: 'Erreur de chargement.', tr: 'Yükleme hatası.' },
  'No products match your filters.': { en: 'No products match your filters.', ka: 'პროდუქტი ვერ მოიძებნა.', ru: 'Товары не найдены.', de: 'Keine Produkte gefunden.', fr: 'Aucun produit trouvé.', tr: 'Ürün bulunamadı.' },
  'Out of Stock': { en: 'Out of Stock', ka: 'არ არის მარაგში', ru: 'Нет в наличии', de: 'Nicht vorrätig', fr: 'Rupture de stock', tr: 'Stokta yok' },
  'Add to Cart': { en: 'Add to Cart', ka: 'კალათში დამატება', ru: 'В корзину', de: 'In den Warenkorb', fr: 'Ajouter au panier', tr: 'Sepete ekle' },
  'Compare': { en: 'Compare', ka: 'შედარება', ru: 'Сравнить', de: 'Vergleichen', fr: 'Comparer', tr: 'Karşılaştır' },
  'Items per Page:': { en: 'Items per Page:', ka: 'გვერდზე:', ru: 'На странице:', de: 'Pro Seite:', fr: 'Par page:', tr: 'Sayfa başına:' },


  // PRODUCTS PAGE (detail)
  'Loading product...': { en: 'Loading product...', ka: 'პროდუქტი იტვირთება...', ru: 'Загрузка...', de: 'Wird geladen...', fr: 'Chargement...', tr: 'Yükleniyor...' },
  'Failed to load product.': { en: 'Failed to load product.', ka: 'პროდუქტი ვერ ჩაიტვირთა.', ru: 'Ошибка загрузки.', de: 'Fehler beim Laden.', fr: 'Erreur de chargement.', tr: 'Yükleme hatası.' },
  'Back': { en: 'Back', ka: 'უკან', ru: 'Назад', de: 'Zurück', fr: 'Retour', tr: 'Geri' },
  'In Stock': { en: 'In Stock', ka: 'მარაგშია', ru: 'В наличии', de: 'Auf Lager', fr: 'En stock', tr: 'Stokta var' },
  'left': { en: 'left', ka: 'დარჩენილი', ru: 'осталось', de: 'übrig', fr: 'restant', tr: 'kaldı' },
  'Adding...': { en: 'Adding...', ka: 'ემატება...', ru: 'Добавление...', de: 'Wird hinzugefügt...', fr: 'Ajout...', tr: 'Ekleniyor...' },
  'Added to Cart!': { en: 'Added to Cart!', ka: 'კალათში დაემატა!', ru: 'Добавлено в корзину!', de: 'In den Warenkorb!', fr: 'Ajouté au panier!', tr: 'Sepete eklendi!' },
  'Please register': { en: 'Please register', ka: 'გაიარე რეგისტრაცია', ru: 'Зарегистрируйтесь', de: 'Bitte registrieren', fr: 'Veuillez vous inscrire', tr: 'Lütfen kayıt olun' },
  'In Compare': { en: 'In Compare', ka: 'შედარებაშია', ru: 'В сравнении', de: 'Im Vergleich', fr: 'En comparaison', tr: 'Karşılaştırmada' },

  'Showing': { en: 'Showing', ka: 'ნაჩვენებია', ru: 'Показано', de: 'Zeige', fr: 'Affichage', tr: 'Gösterilen' },
  'of': { en: 'of', ka: 'სულ', ru: 'из', de: 'von', fr: 'sur', tr: 'toplam' },
  'results': { en: 'results', ka: 'შედეგი', ru: 'результатов', de: 'Ergebnisse', fr: 'résultats', tr: 'sonuç' },
  // PROFILE
  'Loading profile...': { en: 'Loading profile...', ka: 'პროფილი იტვირთება...', ru: 'Загрузка профиля...', de: 'Profil lädt...', fr: 'Chargement...', tr: 'Profil yükleniyor...' },
  'Verified': { en: 'Verified', ka: 'დადასტურებული', ru: 'Подтверждён', de: 'Verifiziert', fr: 'Vérifié', tr: 'Doğrulandı' },
  'Unverified': { en: 'Unverified', ka: 'დაუდასტურებელი', ru: 'Не подтверждён', de: 'Nicht verifiziert', fr: 'Non vérifié', tr: 'Doğrulanmadı' },
  'Info': { en: 'Info', ka: 'ინფო', ru: 'Инфо', de: 'Info', fr: 'Info', tr: 'Bilgi' },
  'Edit': { en: 'Edit', ka: 'რედაქტირება', ru: 'Редактировать', de: 'Bearbeiten', fr: 'Modifier', tr: 'Düzenle' },
  'Delete': { en: 'Delete', ka: 'წაშლა', ru: 'Удалить', de: 'Löschen', fr: 'Supprimer', tr: 'Sil' },
  'Gender': { en: 'Gender', ka: 'სქესი', ru: 'Пол', de: 'Geschlecht', fr: 'Genre', tr: 'Cinsiyet' },
  'Save Changes': { en: 'Save Changes', ka: 'ცვლილებების შენახვა', ru: 'Сохранить', de: 'Speichern', fr: 'Enregistrer', tr: 'Kaydet' },
  'Saving...': { en: 'Saving...', ka: 'ინახება...', ru: 'Сохранение...', de: 'Speichern...', fr: 'Enregistrement...', tr: 'Kaydediliyor...' },
  'Old Password': { en: 'Old Password', ka: 'ძველი პაროლი', ru: 'Старый пароль', de: 'Altes Passwort', fr: 'Ancien mot de passe', tr: 'Eski şifre' },
  'New Password': { en: 'New Password', ka: 'ახალი პაროლი', ru: 'Новый пароль', de: 'Neues Passwort', fr: 'Nouveau mot de passe', tr: 'Yeni şifre' },
  'Confirm New Password': { en: 'Confirm New Password', ka: 'გაიმეორე ახალი პაროლი', ru: 'Подтвердите пароль', de: 'Passwort bestätigen', fr: 'Confirmer le mot de passe', tr: 'Yeni şifreyi onayla' },
  'Passwords match': { en: 'Passwords match', ka: 'პაროლები ემთხვევა', ru: 'Пароли совпадают', de: 'Passwörter stimmen überein', fr: 'Les mots de passe correspondent', tr: 'Şifreler eşleşiyor' },
  'Passwords do not match.': { en: 'Passwords do not match.', ka: 'პაროლები არ ემთხვევა', ru: 'Пароли не совпадают', de: 'Passwörter stimmen nicht überein', fr: 'Les mots de passe ne correspondent pas', tr: 'Şifreler eşleşmiyor' },
  'Change Password': { en: 'Change Password', ka: 'პაროლის შეცვლა', ru: 'Изменить пароль', de: 'Passwort ändern', fr: 'Changer le mot de passe', tr: 'Şifreyi değiştir' },
  'Changing...': { en: 'Changing...', ka: 'იცვლება...', ru: 'Изменение...', de: 'Wird geändert...', fr: 'Modification...', tr: 'Değiştiriliyor...' },
  'Enter old password and new password to change it.': { en: 'Enter old password and new password to change it.', ka: 'შეიყვანე ძველი და ახალი პაროლი მის შესაცვლელად.', ru: 'Введите старый и новый пароль.', de: 'Altes und neues Passwort eingeben.', fr: 'Entrez ancien et nouveau mot de passe.', tr: 'Eski ve yeni şifreyi girin.' },
  'Delete Account': { en: 'Delete Account', ka: 'ანგარიშის წაშლა', ru: 'Удалить аккаунт', de: 'Konto löschen', fr: 'Supprimer le compte', tr: 'Hesabı sil' },
  'This action is': { en: 'This action is', ka: 'ეს მოქმედება', ru: 'Это действие', de: 'Diese Aktion ist', fr: 'Cette action est', tr: 'Bu işlem' },
  'irreversible': { en: 'irreversible', ka: 'შეუქცევადია', ru: 'необратимо', de: 'unwiderruflich', fr: 'irréversible', tr: 'geri alınamaz' },
  'All your data will be permanently deleted.': { en: 'All your data will be permanently deleted.', ka: 'შენი ყველა მონაცემი სამუდამოდ წაიშლება.', ru: 'Все данные будут удалены навсегда.', de: 'Alle Daten werden dauerhaft gelöscht.', fr: 'Toutes vos données seront supprimées.', tr: 'Tüm verileriniz kalıcı olarak silinecek.' },
  'Type to continue:': { en: 'Type to continue:', ka: 'გასაგრძელებლად ჩაწერე:', ru: 'Для продолжения введите:', de: 'Zum Fortfahren eingeben:', fr: 'Tapez pour continuer:', tr: 'Devam etmek için yazın:' },
  'Deleting...': { en: 'Deleting...', ka: 'იშლება...', ru: 'Удаление...', de: 'Wird gelöscht...', fr: 'Suppression...', tr: 'Siliniyor...' },
  'Permanently Delete Account': { en: 'Permanently Delete Account', ka: 'ანგარიშის სამუდამოდ წაშლა', ru: 'Удалить аккаунт навсегда', de: 'Konto dauerhaft löschen', fr: 'Supprimer définitivement', tr: 'Hesabı kalıcı olarak sil' },
  'Profile updated successfully!': { en: 'Profile updated successfully!', ka: 'პროფილი წარმატებით განახლდა!', ru: 'Профиль успешно обновлён!', de: 'Profil erfolgreich aktualisiert!', fr: 'Profil mis à jour!', tr: 'Profil başarıyla güncellendi!' },
  'Update failed. Please try again.': { en: 'Update failed. Please try again.', ka: 'განახლება ვერ მოხერხდა. სცადე თავიდან.', ru: 'Ошибка обновления. Попробуйте снова.', de: 'Aktualisierung fehlgeschlagen.', fr: 'Échec de la mise à jour.', tr: 'Güncelleme başarısız.' },
  'Password changed successfully!': { en: 'Password changed successfully!', ka: 'პაროლი წარმატებით შეიცვალა!', ru: 'Пароль успешно изменён!', de: 'Passwort erfolgreich geändert!', fr: 'Mot de passe modifié!', tr: 'Şifre başarıyla değiştirildi!' },
  'Password change failed. Check your old password.': { en: 'Password change failed. Check your old password.', ka: 'პაროლის შეცვლა ვერ მოხერხდა. შეამოწმე ძველი პაროლი.', ru: 'Ошибка смены пароля. Проверьте старый пароль.', de: 'Fehler beim Ändern. Altes Passwort prüfen.', fr: 'Échec. Vérifiez l\'ancien mot de passe.', tr: 'Şifre değiştirilemedi. Eski şifreyi kontrol edin.' },
  'Password must be at least 6 characters.': { en: 'Password must be at least 6 characters.', ka: 'პაროლი მინიმუმ 6 სიმბოლო უნდა იყოს.', ru: 'Пароль минимум 6 символов.', de: 'Passwort mindestens 6 Zeichen.', fr: 'Mot de passe: 6 caractères minimum.', tr: 'Şifre en az 6 karakter olmalı.' },
  'Account deletion failed.': { en: 'Account deletion failed.', ka: 'ანგარიშის წაშლა ვერ მოხერხდა.', ru: 'Ошибка удаления аккаунта.', de: 'Fehler beim Löschen.', fr: 'Échec de la suppression.', tr: 'Hesap silinemedi.' },


  // CART PAGE
  'Loading cart...': { en: 'Loading cart...', ka: 'კალათა იტვირთება...', ru: 'Загрузка корзины...', de: 'Warenkorb lädt...', fr: 'Chargement...', tr: 'Sepet yükleniyor...' },
  'Failed to load cart.': { en: 'Failed to load cart.', ka: 'კალათის ჩატვირთვა ვერ მოხერხდა.', ru: 'Ошибка загрузки корзины.', de: 'Fehler beim Laden.', fr: 'Erreur de chargement.', tr: 'Sepet yüklenemedi.' },
  'Order Placed!': { en: 'Order Placed!', ka: 'შეკვეთა განხორციელდა!', ru: 'Заказ оформлен!', de: 'Bestellung aufgegeben!', fr: 'Commande passée!', tr: 'Sipariş verildi!' },
  'Your order has been successfully placed. Thank you for shopping with TechZone!': { en: 'Your order has been successfully placed. Thank you for shopping with TechZone!', ka: 'შეკვეთა წარმატებით განხორციელდა. გმადლობ TechZone-ში შოპინგისთვის!', ru: 'Заказ успешно оформлен. Спасибо за покупку!', de: 'Bestellung erfolgreich. Danke!', fr: 'Commande réussie. Merci!', tr: 'Sipariş başarıyla verildi. Teşekkürler!' },
  'Continue Shopping': { en: 'Continue Shopping', ka: 'შოპინგის გაგრძელება', ru: 'Продолжить покупки', de: 'Weiter einkaufen', fr: 'Continuer', tr: 'Alışverişe devam' },
  'Your cart is empty': { en: 'Your cart is empty', ka: 'კალათა ცარიელია', ru: 'Корзина пуста', de: 'Warenkorb leer', fr: 'Panier vide', tr: 'Sepet boş' },
  "Looks like you haven't added anything yet.": { en: "Looks like you haven't added anything yet.", ka: 'ჯერ არაფერი დაგიმატებია.', ru: 'Вы ещё ничего не добавили.', de: 'Noch nichts hinzugefügt.', fr: "Vous n'avez rien ajouté.", tr: 'Henüz bir şey eklemediniz.' },
  'Start Shopping': { en: 'Start Shopping', ka: 'შოპინგის დაწყება', ru: 'Начать покупки', de: 'Einkaufen', fr: 'Commencer', tr: 'Alışverişe başla' },
  'Your Cart': { en: 'Your Cart', ka: 'შენი კალათა', ru: 'Ваша корзина', de: 'Ihr Warenkorb', fr: 'Votre panier', tr: 'Sepetiniz' },
  'Clear All': { en: 'Clear All', ka: 'გასუფთავება', ru: 'Очистить', de: 'Alles löschen', fr: 'Tout effacer', tr: 'Hepsini sil' },
  'Order Summary': { en: 'Order Summary', ka: 'შეკვეთის სარეზიუმე', ru: 'Итог заказа', de: 'Bestellübersicht', fr: 'Récapitulatif', tr: 'Sipariş özeti' },
  'Items': { en: 'Items', ka: 'პროდუქტები', ru: 'Товары', de: 'Artikel', fr: 'Articles', tr: 'Ürünler' },
  'Total': { en: 'Total', ka: 'სულ', ru: 'Итого', de: 'Gesamt', fr: 'Total', tr: 'Toplam' },
  'Processing...': { en: 'Processing...', ka: 'მუშავდება...', ru: 'Обработка...', de: 'Verarbeitung...', fr: 'Traitement...', tr: 'İşleniyor...' },
  'Checkout': { en: 'Checkout', ka: 'გადახდა', ru: 'Оформить', de: 'Zur Kasse', fr: 'Commander', tr: 'Ödeme yap' },

  // WARRANTY
  'year warranty': { en: 'year warranty', ka: 'წლიანი გარანტია', ru: 'лет гарантии', de: 'Jahr Garantie', fr: 'an de garantie', tr: 'yıl garanti' },
};

@Injectable({ providedIn: 'root' })
export class TranslationService {
  currentLang = signal<SupportedLang>('en');
  isTranslating = signal(false);

  t(key: string): string {
    const lang = this.currentLang();
    return TRANSLATIONS[key]?.[lang] ?? key;
  }

  setLanguage(lang: SupportedLang) {
    this.currentLang.set(lang);
  }
}
